/* global pagenow, postboxes */

/**
 * Internal dependencies.
 */
import { eddLabelFormatter, eddLegendFormatterSales, eddLegendFormatterEarnings } from './formatting.js';
import './charts';

// Enable reports meta box toggle states.
if ( typeof postboxes !== 'undefined' && /edd-reports/.test( pagenow ) ) {
	postboxes.add_postbox_toggles( pagenow );
}

/**
 * Reports / Exports screen JS
 */
const EDD_Reports = {

	init: function() {
		this.meta_boxes();
		this.date_options();
		this.customers_export();
	},

	meta_boxes: function() {
		$( '.edd-reports-wrapper .postbox .handlediv' ).remove();
		$( '.edd-reports-wrapper .postbox' ).removeClass( 'closed' );

		// Use a timeout to ensure this happens after core binding
		setTimeout( function() {
			$( '.edd-reports-wrapper .postbox .hndle' ).unbind( 'click.postboxes' );
		}, 1 );
	},

	date_options: function() {
		// Show hide extended date options
		$( 'select.edd-graphs-date-options' ).on( 'change', function( event ) {
			const	select = $( this ),
				date_range_options = select.parent().siblings( '.edd-date-range-options' );

			$('.edd-date-range-dates').addClass( 'hidden' );

			if ( 'other' === select.val() ) {
				date_range_options.removeClass( 'screen-reader-text' );
			} else {
				date_range_options.addClass( 'screen-reader-text' );
				$('.edd-date-range-dates').removeClass( 'hidden' );
				$( '.edd-date-range-selected-date span' ).addClass( 'hidden' )
				$( '.edd-date-range-selected-date span[data-range="' + select.val() + '"]' ).removeClass( 'hidden' )
			}
		} );

		$( '.edd-date-range-dates' ).on( 'click', function( event ) {
			event.preventDefault();
			$( 'select.edd-graphs-date-options' ).trigger( 'focus' );
		});

		/**
		 * Relative date ranges.
		 */

			const relativeDateRangesParent = $( '.edd-date-range-selected-relative-date' );

			// Open relative daterange dropdown.
			relativeDateRangesParent.on( 'click', function( event ) {
				event.preventDefault();
				$( this ).toggleClass( 'opened' );
			});

			// If a click event is triggered on body.
			$( document ).on( 'click', function( e ) {
				EDD_Reports.close_relative_ranges_dropdown( e.target );
			});

			// If the Escape key is pressed.
			$( document ).on( 'keydown', function( event ) {
				const key = event.key;
				if ( key === "Escape" ) {
					EDD_Reports.close_relative_ranges_dropdown();
				}
			});

			// Select relative daterange.
			$( '.edd-date-range-relative-dropdown li' ).on( 'click', function() {
				$('.edd-graphs-relative-date-options').val( $(this).data( 'range' ) ).trigger( 'change' );
			});

			$('.edd-graphs-relative-date-options').on( 'change', function() {
				var selected_range_name = $( '.edd-date-range-relative-dropdown li[data-range="' + $( this ).val() + '"] .date-range-name' ).text();
				$( '.edd-date-range-selected-relative-range-name' ).html( selected_range_name )
			} )

	},

	close_relative_ranges_dropdown: function( target = false ) {
		var relativeDateRangesParent = $( '.edd-date-range-selected-relative-date' );

		if ( ! relativeDateRangesParent.hasClass( 'opened' ) ) {
			return false;
		}

		if ( false === target || ( ! relativeDateRangesParent.is( target ) && ! relativeDateRangesParent.has( target ).length ) ) {
			relativeDateRangesParent.removeClass( 'opened' );
		}
	},

	customers_export: function() {
		// Show / hide Download option when exporting customers
		$( '#edd_customer_export_download' ).change( function() {
			const $this = $( this ),
				download_id = $( 'option:selected', $this ).val(),
				customer_export_option = $( '#edd_customer_export_option' );

			if ( '0' === $this.val() ) {
				customer_export_option.show();
			} else {
				customer_export_option.hide();
			}

			// On Download Select, Check if Variable Prices Exist
			if ( parseInt( download_id ) !== 0 ) {
				const data = {
					action: 'edd_check_for_download_price_variations',
					download_id: download_id,
					all_prices: true,
				};

				var price_options_select = $( '.edd_price_options_select' );

				$.post( ajaxurl, data, function( response ) {
					price_options_select.remove();
					$( '#edd_customer_export_download_chosen' ).after( response );
				} );
			} else {
				price_options_select.remove();
			}
		} );
	},
};

jQuery( document ).ready( function( $ ) {
	EDD_Reports.init();
} );
