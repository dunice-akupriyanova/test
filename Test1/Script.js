var val, row_id, j, begin, item_id, item_type, now, row_id, d, sort_type='updated', sort_way='up';
var compare_date = function (a, b) {
    switch (sort_type) {
        case 'updated': {
            a = new Date(a.date);
            b = new Date(b.date);
            if (sort_way=='up'){
                return (a - b);
            } else  return (b - a);
        }
        case 'status': {
            a=+a.status;
            b=+b.status;
            if (sort_way=='up'){
                return (a - b);
            } else  return (b - a);
        }
        case 'name':{
            console.log("name");
            a=a.title;
            b=b.title;
            console.log('a='+a);
            console.log('b='+b);
            if (sort_way=='up'){
                return a>b?1:-1;
            } else  return a>b?-1:1;
        }
        case "author": {
            a=a.author;
            b=b.author;
            if (sort_way=='up'){
                return a>b?1:-1;
            } else  return a>b?-1:1;
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
    $('#status_sort, #name_sort, #author_sort, #updated_sort').click(function(){
        sort_type=$(this).data("type");
        if($(this).data("way")=='down'){
            sort_way='up';
            $(this).data("way", 'up');
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        } else{
            sort_way='down';
            $(this).data("way", 'down');
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            redraw();
        }
            console.log('sort_way='+sort_way);
            console.log('sort_type='+sort_type);
    });
});
