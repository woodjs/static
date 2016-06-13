define(['jquery', 'inputValueCtrl', 'promptUI'], function(jQuery) {

	(function($) {

		//pageNumber
		$(document).on('keydown', '.page-number [data-type=pageNumberInputBox]', function(e) {
			var $this = $(this);
			if (e.keyCode == 13) {
				$this.closest('.page-number').find('[data-type=pageNumberSubmitBtn]').trigger("click");
			}
		});
		$(document).on('click', '.page-number [data-type=pageNumberSubmitBtn]', function() {
			var $this = $(this);
			var $thisPageNumber = $this.closest('.page-number');
			var $thisPageInput = $thisPageNumber.find('[data-type=pageNumberInputBox]');
			var urltpl = $this.attr('data-urltpl');
			var value = $.trim($thisPageInput.val());

			if (value === '') {
				$.promptUI({
					type: 'wran',
					title: '提示',
					content: '请输入页码'
				});
				return;
			}

			if (value === '0') {
				$.promptUI({
					type: 'wran',
					title: '提示',
					content: '无效的页码'
				});
				return;
			}

			window.location.href = urltpl.replace('{{pageNumber}}', value);
		});

	})(jQuery);


});