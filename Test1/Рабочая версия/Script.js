var val, row_id, j, begin, item_id, item_type, now, row_id, d, sort='updated_up';
var compare_date = function (a, b) {
    switch (sort) {
        case 'updated_up': {
            a = new Date(a.date);
            b = new Date(b.date);
            return (a - b);
        }
        case 'updated_down': {
            a = new Date(a.date);
            b = new Date(b.date);
            return (b - a);
        }
        case 'status_up': {
            a=+a.status;
            b=+b.status;
            return (a-b);
        }
        case 'status_down': {
            a=+a.status;
            b=+b.status;
            return (b-a);
        }
        case 'name_up':{
            a=a.title;
            b=b.title;
            return a>b?1:-1;
        }
        case 'name_down': {
            a=a.title;
            b=b.title;
            return a>b?-1:1;
        }
        case "author_up": {
            a=a.author;
            b=b.author;
            return a>b?1:-1;
        }
        case "author_down": {
            a=a.author;
            b=b.author;
            return a>b?-1:1;
        }
        default: return 1;
    }
}
var redraw = function() {
    data.sort(compare_date);
    $('#articles').empty();
    for (j = 0; j < data.length; j++) {
        d = new Date(data[j].date);
        if (data[j].status == false) {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + moment(d).format("DD-MM-YYYY HH:mm") + "</td><td><botton class=\"delete\">Удалить</botton></td></tr>");
        } else {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + moment(d).format("DD-MM-YYYY HH:mm") + "</td><td><botton class=\"delete\">Удалить</botton></td></tr>");
        }
    }
}
$(document).ready(function () {
    data = [];
    if ((typeof localStorage.data) == 'undefined') {
        localStorage.data = JSON.stringify(data);
    }
    data = JSON.parse(localStorage.data);
    redraw();
    $('.button_add').click(function (event) {
         event.preventDefault();
        if ($('input[name="title"]').val().length == 0) {
            $('input[name="title"]').addClass('red');
        } else {
            $('input[name="title"]').removeClass('red');
        }
        if ($('input[name="author"]').val().length == 0) {
            $('input[name="author"]').addClass('red');
        } else {
            $('input[name="author"]').removeClass('red');
        }
        if (($('input[name="author"]').val().length != 0) && ($('input[name="title"]').val().length != 0)) {
            now = new Date();
            data.push({
                title: $('input[name="title"]').val(),
                author: $('input[name="author"]').val(),
                date: now.toLocaleString(),
                id: +new Date(),
                status: false
            });
            $("input[name='title']").val('');
            $("input[name='author']").val('');
            localStorage.data = JSON.stringify(data);
            redraw();
        }
    });

    $("body").on("dblclick", ".etitable", function (e) {
        e.preventDefault();
        //ловим элемент, по которому кликнули
        var t = e.target || e.srcElement;
        //получаем название тега
        var elm_name = t.tagName.toLowerCase();
        //если это инпут - ничего не делаем
        if (elm_name == 'input') { return false; }
        val = $(this).html();
        var code = '<input type="text" id="edit" style="width: 100%" value="' + val + '" />';
        $(this).empty().append(code);
        $('#edit').focus();
        $('#edit').blur(function () {
            if ($(this).val() != '') {
                val = $(this).val();
                begin = ($(this).parent().attr('id').indexOf('title')) + ($(this).parent().attr('id').indexOf('author')) + 1;
                item_id = $(this).parent().attr('id').substring(1, begin);
                item_type = $(this).parent().attr('id').substring(begin);
                data[+item_id][item_type] = val;
                now = new Date();
                data[+item_id].date = now.toLocaleString();
                data[+item_id].id = +new Date();
                localStorage.data = JSON.stringify(data);
                row_id = $(this).parent().parent().attr('id').substr(1);
                $(this).parent().empty().html(val);
                redraw();
            } else {
                $('#edit').focus();
                $('#edit').addClass('red');
            }
        });
    });
    $("body").keydown(function (event) {
        //ловим событие нажатия клавиши
        if (event.keyCode == 13) {	//если это Enter
            $('#edit').blur();	//снимаем фокус с поля ввода
            // $("body").on("dblclick", ".etitable");
        }
    });
    $("body").on("click", "input[type='checkbox']", function () {
        row_id = $(this).parent().parent().attr('id').substr(1);
        if (data[+row_id].status == false) {
            data[+row_id].status = true;
        }
        else {
            data[+row_id].status = false;
        }
        now = new Date();
        data[+row_id].date = now.toLocaleString();
        localStorage.data = JSON.stringify(data);
        redraw();
    });

    $("body").on("click", ".delete", function () {
        row_id = $(this).parent().parent().attr('id').substr(1);
        $(this).parent().parent().remove();
        data.splice(row_id, 1);
        localStorage.data = JSON.stringify(data);
    });
    $('#status_sort').click(function(){
        if(sort=='status_down'){
            sort='status_up';
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        } else{
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            sort='status_down';
            redraw();
        }
    });
    $('#name_sort').click(function(){
        if(sort=='name_down'){
            sort='name_up';
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        } else{
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            sort='name_down';
            redraw();
        }
    });
    $('#author_sort').click(function(){
        if(sort=='author_down'){
            sort='author_up';
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        } else {
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            sort='author_down';
            redraw();
        }
    });
    $('#updated_sort').click(function(){
        if(sort=='updated_down'){
            sort='updated_up';
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        } else {
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            sort='updated_down';
            redraw();
        }
    });
});
