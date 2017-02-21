var val, row_id, j, begin, item_id, item_type, row_id, sort_type, sort_way, start, finish;
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
            a=a.title;
            b=b.title;
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
    if (((typeof localStorage.limit)=='undefined')||(localStorage.limit=='all')||((+localStorage.limit!=5)&&(+localStorage.limit!=10))) {
        localStorage.limit=data.length;
    }
    if ((typeof localStorage.page)=='indefined'){
        localStorage.page=1;
    }
    $('#articles').empty();
    start=+localStorage.limit*(+localStorage.page-1);
    finish=+localStorage.limit+start;
    if (finish>data.length){
        finish=data.length;
    }
    for (j = start; j <finish; j++) {
        d = new Date(data[j].date);
        if (data[j].status == false) {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + moment(d).format("DD-MM-YYYY HH:mm") + "</td><td><button class=\"delete\">Удалить</button></td></tr>");
        } else {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + moment(d).format("DD-MM-YYYY HH:mm") + "</td><td><button class=\"delete\">Удалить</button></td></tr>");
        }
    }        
    $('.navigation').empty();
    if (((+localStorage.limit)==5)||((+localStorage.limit)==10)) {
    $('.navigation').append('<span class="arrow first"><<</span><span class="arrow prev"><</span><div class="list" style="display: inline-block"></div><span class="arrow next">></span><span class="arrow last">>></span>');
        for (var i=1; i<Math.ceil(data.length/localStorage.limit)+1; i++) {
            $('.list').append("<div class='page page"+i+"' data-page='"+i+"'>"+i+"</div>");
        }
    }
    $('.page'+localStorage.page).addClass('active');
}
$(document).ready(function () {
    data = [];
    if ((typeof localStorage.data) == 'undefined') {
        localStorage.data = JSON.stringify(data);
    }
    if (+localStorage.limit==5){
        $('.pages5').addClass('active');
    } else
    if (+localStorage.limit==10){
        $('.pages10').addClass('active');
    } else $('.all').addClass('active');
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
            data.push({
                title: $('input[name="title"]').val(),
                author: $('input[name="author"]').val(),
                date: new Date(),
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
                data[+item_id].date = new Date();
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
        data[+row_id].date = new Date();
        localStorage.data = JSON.stringify(data);
        redraw();
    });

    $("body").on("click", ".delete", function () {
        row_id = $(this).parent().parent().attr('id').substr(1);
        data.splice(row_id, 1);
        localStorage.data = JSON.stringify(data);
        redraw();
    });
    $('#status_sort, #name_sort, #author_sort, #updated_sort').click(function(){
        sort_type=$(this).data("type");
        if($(this).data("way")=='down'){
            sort_way='up';
            $(this).data("way", 'up');
            val='<img src="up.jpg" style="width: 20px; height: 20px">'
            $(this).html(val);
            data.sort(compare_date);
            localStorage.page=1;
            redraw();
        } else{
            sort_way='down';
            $(this).data("way", 'down');
            val='<img src="down.png" style="width: 20px; height: 20px">'
            $(this).html(val);
            data.sort(compare_date);
            localStorage.page=1;
            redraw();
        }
    });
    $('.pages5, .pages10, .all').click(function(){
        if (($(this).data("limit")==5)||($(this).data("limit")==10)){
            localStorage.limit = $(this).data("limit");
        } else localStorage.limit = data.length;
        $('.pages5').removeClass('active');
        $('.pages10').removeClass('active');
        $('.all').removeClass('active');
        $(this).addClass('active');
        localStorage.page=1;
        redraw();
        $('.navigation').empty();
        if (((+localStorage.limit)==5)||((+localStorage.limit)==10)) {
        $('.navigation').append('<span class="arrow first"><<</span><span class="arrow prev"><</span><div class="list" style="display: inline-block"></div><span class="arrow next">></span><span class="arrow last">>></span>');
            for (var i=1; i<Math.ceil(data.length/localStorage.limit)+1; i++) {
                $('.list').append("<div class='page page"+i+"' data-page='"+i+"'>"+i+"</div>");
            }
        }
        $('.page'+localStorage.page).addClass('active');
    });
    $("body").on("click", ".page", function (){
        localStorage.page=$(this).data("page");
        redraw();
    });
    $("body").on("click", ".first", function (){
        if ((+localStorage.page)!=1){
            localStorage.page=1;
            redraw();
        }
    });
    $("body").on("click", ".last", function (){
        if ((+localStorage.page)!=Math.ceil(data.length/localStorage.limit)){
            localStorage.page=Math.ceil(data.length/localStorage.limit);
            redraw();
        }
    });
    $("body").on("click", ".prev", function (){
        if ((+localStorage.page)!=1){
            localStorage.page=+localStorage.page-1;
            redraw();
        }
    });
    $("body").on("click", ".next", function (){
        if ((+localStorage.page)!=Math.ceil(data.length/localStorage.limit)){
            localStorage.page=+localStorage.page+1;
            redraw();
        }
    });
});
