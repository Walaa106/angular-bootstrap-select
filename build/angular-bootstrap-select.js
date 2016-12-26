// supply open and close without load bootstrap.js
angular.module('angular-bootstrap-select.extra', [])
  .directive('toggle', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        // prevent directive from attaching itself to everything that defines a toggle attribute
        if (!element.hasClass('selectpicker')) {
          return;
        }
        var element = $('.selectpicker');
        var target = element.parent();
        var toggleFn = function () {
          target.toggleClass('open');
        };
        var hideFn = function () {
          target.removeClass('open');
        };

        element.on('click', toggleFn);
        element.next().on('click', hideFn);

        scope.$on('$destroy', function () {
          element.off('click', toggleFn);
          element.next().off('click', hideFn);
        });
      }
    };
  });

angular.module('angular-bootstrap-select', [])
  .directive('selectpicker', ['$timeout', '$parse', function ($parse, $timeout) {
    return {
      restrict: 'A',
      require: '?ngModel',
      priority: 10,
      link: function (scope, element, attrs) {
        element = $('.selectpicker');
        function refresh(newVal) {
          scope.$applyAsync(function () {
            element.selectpicker('refresh');
          });
        }

        attrs.$observe('spTheme', function (val) {
          $timeout(function () {
            element.data('selectpicker').$button.removeClass(function (i, c) {
              return (c.match(/(^|\s)?btn-\S+/g) || []).join(' ');
            });
            element.selectpicker('setStyle', val);
          });
        });

        $timeout(function () {
          element.selectpicker($parse(attrs.selectpicker)());
          element.selectpicker('refresh');
        });

        if (attrs.ngModel) {
          scope.$watch(attrs.ngModel, refresh, true);
        }

        if (attrs.ngDisabled) {
          scope.$watch(attrs.ngDisabled, refresh, true);
        }

        scope.$on('$destroy', function () {
          $timeout(function () {
            element.selectpicker('destroy');
          });
        });
      }
    };
  }]);
