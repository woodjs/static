define(['jquery'], function(jQuery) {

	(function($) {

		$(document).off('keyup.input_val_ctrl');

		$(document).on('keyup.input_val_ctrl', 'input[data-valuetype=number]', function() {
			var $this = $(this);
			var thisValue = $.trim($this.val());
			var newValue = isNaN(parseFloat(thisValue)) ? '' : parseFloat(thisValue);
			if (/\.$/.test(thisValue)) {
				if (/\./.test(thisValue.replace(/\./, ''))) {
					$this.val(newValue);
				} else {
					$this.val(newValue + '.');
				}
			} else {
				$this.val(newValue);
			}
		});

		$(document).on('keyup.input_val_ctrl', 'input[data-valuetype=int]', function() {
			var $this = $(this);
			var thisValue = $.trim($this.val());
			var newValue = isNaN(parseInt(thisValue)) ? '' : parseInt(thisValue);
			$this.val(newValue);
		});

	})(jQuery);


});