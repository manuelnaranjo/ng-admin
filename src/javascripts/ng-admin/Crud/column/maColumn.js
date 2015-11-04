export default function maColumn($state, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {

    function getDetailLinkRouteName(field, entity) {
        if (entity.isReadOnly) {
            return entity.showView().enabled ? 'show' : false;
        }
        if (field.detailLinkRoute() == 'edit' && entity.editionView().enabled) {
            return 'edit';
        }
        return entity.showView().enabled ? 'show' : false;
    }

    function isDetailLink(field, entity) {
        if (field.isDetailLink() === false) {
            return false;
        }
        if (field.type() == 'reference' || field.type() == 'reference_many' || field.type() == 'nested_reference') {
            var relatedEntity = Configuration().getEntity(field.targetEntity().name());
            if (!relatedEntity) {
                return false;
            }
            return getDetailLinkRouteName(field, relatedEntity) !== false;
        }
        return getDetailLinkRouteName(field, entity) !== false;
    }

    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            datastore: '&'
        },
        link: function(scope, element) {
            scope.datastore = scope.datastore();
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.value = typeof scope.entry === 'undefined'
                ? ''
                : scope.entry.values[scope.field.name()];
            scope.entity = scope.entity();
            let customTemplate = scope.field.getTemplateValue(scope.entry);
            if (customTemplate) {
                element.append(customTemplate);
            } else {
                let type = scope.field.type();
                let widget;
                if (isDetailLink(scope.field, scope.entity)) {
                    widget = FieldViewConfiguration[type].getLinkWidget();
                } else if (FieldViewConfiguration[type]){
                    widget = FieldViewConfiguration[type].getReadWidget();
                } else {
                    widget = '';
                }
                element.append(widget);
                if (widget.indexOf('gotoDetail')>-1) {
                    element.children().attr('ng-href', '{{::getDetail()}}');
                }
                else if (widget.indexOf('gotoReference')>-1) {
                    element.children().attr('ng-href', '{{::getReference()}}');
                }
            }
            $compile(element.contents())(scope);
            scope.gotoDetail = function () {
                var route = getDetailLinkRouteName(scope.field, scope.entity);
                $state.go($state.get(route),
                angular.extend({}, $state.params, {
                    entity: scope.entry.entityName,
                    id: scope.entry.identifierValue
                }));
            };
            scope.gotoReference = function () {
                var referenceEntity = scope.field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);
                var referenceId;

                if (scope.field.type() !== 'nested_reference') {
                    referenceId = scope.entry.values[scope.field.name()];
                } else {
                    console.log('nested id');
                    referenceId = scope.field.referenceId(scope.entry);
                }
                var route = getDetailLinkRouteName(scope.field, relatedEntity);
                $state.go($state.get(route), {
                    entity: referenceEntity,
                    id: referenceId
                });
            };
            scope.getReference = function () {
                var referenceEntity = scope.field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);
                var referenceId;
                if (scope.field.type() !== 'nested_reference') {
                    referenceId = scope.entry.values[scope.field.name()];
                } else {
                    referenceId = scope.field.referenceId(scope.entry);
                }
                var route = getDetailLinkRouteName(scope.field, relatedEntity);
                var params = {
                    entity: referenceEntity,
                    id: referenceId
                };
                return $state.href(route, params);
            };
        }
    };
}

maColumn.$inject = ['$state', '$anchorScroll', '$compile', 'NgAdminConfiguration', 'FieldViewConfiguration'];
