function compare(a, b){
    a=new Date(a.date);
    b=new Date(b.date);
    return(a-b);
}
function fillZero(a){
    if(a<10) {
        return ('0'+a);
    } else {
        return a;
    }
}
$(document).ready(function () {
    var dd, mm, yy, time, hh, min;
    data=[];
    if ((typeof localStorage.data)=='undefined') {
        localStorage.data = JSON.stringify(data);
    }
    data=JSON.parse(localStorage.data);
    data.sort(compare);
    for (var j = 0; j < data.length; j++) {
        var d=new Date(data[j].date);    
        mm=d.getMonth()+1;
        mm=fillZero(mm);
        dd = d.getDate();
        dd=fillZero(dd);
        yy = d.getFullYear();
        hh = d.getHours();
        hh=fillZero(hh);
        min = d.getMinutes();
        min=fillZero(min);
        if (data[j].status == false) {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
        } else {
            $('#articles').append("<tr id=\"r" + j + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
        }

    }
    $('#button_add').click(function (event) {
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
            now=new Date();
            data.push({
                title: $('input[name="title"]').val(),
                author: $('input[name="author"]').val(),
                date: now.toLocaleString(),
                id: +new Date(),
                status: false
            });
            localStorage.data = JSON.stringify(data);
            var d=new Date(data[data.length-1].date);      
            mm=d.getMonth()+1;
            mm=fillZero(mm);
            dd = d.getDate();
            dd=fillZero(dd);
            yy = d.getFullYear();
            hh = d.getHours();
            hh=fillZero(hh);
            min = d.getMinutes();
            min=fillZero(min);
            if (data[data.length-1].status == false) {
            $('#articles').append("<tr id=\"r" + (data.length-1) + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + (data.length-1) + "title\">" + data[data.length-1].title + "</td><td class=\"etitable\" id=\"i" + (data.length-1) + "author\">" + data[data.length-1].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
            } else { 
                $('#articles').append("<tr id=\"r" + (data.length-1) + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + (data.length-1) + "title\">" + data[data.length-1].title + "</td><td class=\"etitable\" id=\"i" + (data.length-1) + "author\">" + data[data.length-1].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
            }
        }
    });
    $(function()	{
        var val;
        $("body").on("dblclick", "td.etitable", function(e)	{
            //ловим элемент, по которому кликнули
            var t = e.target || e.srcElement;
            //получаем название тега
            var elm_name = t.tagName.toLowerCase();
            //если это инпут - ничего не делаем
            if(elm_name == 'input')	{return false;}
            val = $(this).html();
            var code = '<input type="text" id="edit" style="width: 100%" value="'+val+'" />';
            $(this).empty().append(code);
            $('#edit').focus();
            $('#edit').blur(function()	{
                if ($(this).val()!=''){
                val = $(this).val();
                var begin=($(this).parent().attr('id').indexOf('title'))+($(this).parent().attr('id').indexOf('author'))+1;
                var item_id=$(this).parent().attr('id').substring(1, begin);
                var item_type=$(this).parent().attr('id').substring(begin);
                data=JSON.parse(localStorage.data);
                data[+item_id][item_type]=val;
                var now=new Date();
                data[+item_id].date=now.toLocaleString();
                data[+item_id].id=+new Date();
                localStorage.data = JSON.stringify(data);
                var row_id=$(this).parent().parent().attr('id').substr(1);
                row_id=+row_id;
                $(this).parent().parent().remove();
                var d=new Date(data[data.length-1].date);      
                mm=d.getMonth()+1;
                mm=fillZero(mm);
                dd = d.getDate();
                dd=fillZero(dd);
                yy = d.getFullYear();
                hh = d.getHours();
                hh=fillZero(hh);
                min = d.getMinutes();
                min=fillZero(min);
                if (data[item_id].status == false) {
                $('#articles').append("<tr id=\"r" + (row_id) + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + row_id + "title\">" + data[row_id].title + "</td><td class=\"etitable\" id=\"i" + row_id + "author\">" + data[row_id].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
                } else { 
                    $('#articles').append("<tr id=\"r" + (row_id) + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + row_id + "title\">" + data[row_id].title + "</td><td class=\"etitable\" id=\"i" + row_id + "author\">" + data[row_id].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
                }
                $(this).parent().empty().html(val);
            } else {
                $('#edit').focus();
                $('#edit').addClass('red');
            }
            });
        });
        $(window).keydown(function(event){
        //ловим событие нажатия клавиши
        if(event.keyCode == 13) {	//если это Enter
            $('#edit').blur();	//снимаем фокус с поля ввода
        }
    });
    $("body").on("click", "input[type='checkbox']", function(){
        data=JSON.parse(localStorage.data);
        var row_id=$(this).parent().parent().attr('id').substr(1);
        if(data[+row_id].status==false) {
            data[+row_id].status=true;
        }
        else {
            data[row_id].status=false;
        }
        var now=new Date();
        data[+row_id].date=now.toLocaleString();
        localStorage.data = JSON.stringify(data);
        $(this).parent().parent().remove();
        var d=new Date(data[data.length-1].date);      
        mm=d.getMonth()+1;
        mm=fillZero(mm);
        dd = d.getDate();
        dd=fillZero(dd);
        yy = d.getFullYear();
        hh = d.getHours();
        hh=fillZero(hh);
        min = d.getMinutes();
        min=fillZero(min);
        if (data[row_id].status == false) {
        $('#articles').append("<tr id=\"r" + (row_id) + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + row_id + "title\">" + data[row_id].title + "</td><td class=\"etitable\" id=\"i" + row_id + "author\">" + data[row_id].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
        } else { 
            $('#articles').append("<tr id=\"r" + (row_id) + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + row_id + "title\">" + data[row_id].title + "</td><td class=\"etitable\" id=\"i" + row_id + "author\">" + data[row_id].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
        }
    }); 
    
    $("body").on("click", ".delete", function () {
        var row_id=$(this).parent().parent().attr('id').substr(1);
        $(this).parent().parent().remove();
        data=JSON.parse(localStorage.data);
        data.splice(row_id, 1);
        localStorage.data = JSON.stringify(data);
    });
});
});
