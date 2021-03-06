( function ( mw ) {
	/**
	 * Widget defining the button controlling the popup for the number of results
	 *
	 * @extends OO.ui.Widget
	 *
	 * @constructor
	 * @param {mw.rcfilters.Controller} controller Controller
	 * @param {mw.rcfilters.dm.FiltersViewModel} model View model
	 * @param {Object} [config] Configuration object
	 * @cfg {jQuery} [$overlay] A jQuery object serving as overlay for popups
	 */
	mw.rcfilters.ui.ChangesLimitButtonWidget = function MwRcfiltersUiChangesLimitWidget( controller, model, config ) {
		config = config || {};

		// Parent
		mw.rcfilters.ui.ChangesLimitButtonWidget.parent.call( this, config );

		this.controller = controller;
		this.model = model;

		this.$overlay = config.$overlay || this.$element;

		this.button = null;
		this.limitGroupModel = null;

		this.model.connect( this, {
			initialize: 'onModelInitialize'
		} );

		this.$element
			.addClass( 'mw-rcfilters-ui-changesLimitButtonWidget' );
	};

	/* Initialization */

	OO.inheritClass( mw.rcfilters.ui.ChangesLimitButtonWidget, OO.ui.Widget );

	/**
	 * Respond to model initialize event
	 */
	mw.rcfilters.ui.ChangesLimitButtonWidget.prototype.onModelInitialize = function () {
		var changesLimitPopupWidget, selectedItem, currentValue;

		this.limitGroupModel = this.model.getGroup( 'limit' );

		// HACK: We need the model to be ready before we populate the button
		// and the widget, because we require the filter items for the
		// limit and their events. This addition is only done after the
		// model is initialized.
		// Note: This will be fixed soon!
		if ( this.limitGroupModel ) {
			changesLimitPopupWidget = new mw.rcfilters.ui.ChangesLimitPopupWidget(
				this.limitGroupModel
			);

			selectedItem = this.limitGroupModel.getSelectedItems()[ 0 ];
			currentValue = ( selectedItem && selectedItem.getLabel() ) ||
				mw.language.convertNumber( this.limitGroupModel.getDefaultParamValue() );

			this.button = new OO.ui.PopupButtonWidget( {
				indicator: 'down',
				label: mw.msg( 'rcfilters-limit-shownum', currentValue ),
				$overlay: this.$overlay,
				popup: {
					width: 300,
					padded: true,
					anchor: false,
					align: 'backwards',
					$autoCloseIgnore: this.$overlay,
					$content: changesLimitPopupWidget.$element
				}
			} );

			// Events
			this.limitGroupModel.connect( this, { update: 'onLimitGroupModelUpdate' } );
			changesLimitPopupWidget.connect( this, { limit: 'onPopupLimit' } );

			this.$element.append( this.button.$element );
		}
	};

	/**
	 * Respond to popup limit change event
	 *
	 * @param {string} filterName Chosen filter name
	 */
	mw.rcfilters.ui.ChangesLimitButtonWidget.prototype.onPopupLimit = function ( filterName ) {
		this.controller.toggleFilterSelect( filterName, true );
	};

	/**
	 * Respond to limit choose event
	 *
	 * @param {string} filterName Filter name
	 */
	mw.rcfilters.ui.ChangesLimitButtonWidget.prototype.onLimitGroupModelUpdate = function () {
		var item = this.limitGroupModel.getSelectedItems()[ 0 ],
			label = item && item.getLabel();

		// Update the label
		if ( label ) {
			this.button.setLabel( mw.msg( 'rcfilters-limit-shownum', label ) );
		}
	};

}( mediaWiki ) );
