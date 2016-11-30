define(['jquery'], function(jQuery) {

	(function($) {
		
		$(document).off('click.form_checkbox');
		
		$(document).on('click.form_checkbox', '.form-checkbox', function(e) {
			var $this = $(this);

			if ($this.hasClass('disabled')) {
				return;
			}
			if ($this.hasClass('checked')) {
				$this.removeClass('checked indeterminate');
			} else {
				$this.removeClass('indeterminate').addClass('checked');
			}

			$this.trigger('evtChange');

			if ($this.hasClass('link-disabled')) {
				e.preventDefault();
			}
		});

	})(jQuery);
});