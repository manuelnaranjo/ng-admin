var ReferenceFieldView = require('./ReferenceFieldView');

module.exports = {
    getReadWidget:   () => '<ma-reference-column field="::field" value="::field.labelDisplay(entry)" datastore="::datastore"></ma-reference-column>',
    getLinkWidget:   () => '<ma-reference-link-column entry="::entry" field="::field" value="::field.labelDisplay(entry)" datastore="::datastore"></ma-reference-link-column>',
    getFilterWidget: () => ReferenceFieldView.getFilterWidget(),
    getWriteWidget:  () => ReferenceFieldView.getWriteWidget()
};
