define(['jquery'], function(jQuery) {

	(function($) {
		
		$(document).off('click.choose_box');
		
		$(document).on('click.choose_box', '.check-box', function(e) {
			var $this = $(this),
				dataName = $this.attr('data-name');
			
			if ($this.hasClass('disabled')) {
				return;
			}

			if ($this.attr('data-type') === 'radio' && dataName) {
				$('.check-box[data-name=' + dataName + '][data-type=radio]').removeClass('checked');
				$this.addClass('checked');
			} else {
				if ($this.hasClass('checked')) {
					$this.removeClass('checked');
				} else {
					$this.addClass('checked');
				}
			}

		});

	})(jQuery);
});