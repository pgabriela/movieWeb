$("#TextAreaID1").bind('input propertychange', function () {
    var maxLength = 300;
    if ($(this).val().length > maxLength) {
        $(this).val($(this).val().substring(0, maxLength));
    }
});
