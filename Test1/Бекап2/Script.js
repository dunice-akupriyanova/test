$(document).ready(function () {
    var dd, mm, yy, time, hh, min;
    data=[];
    data=JSON.parse(localStorage.data);
    for (var j = 0; j < data.length; j++) {
        var first = data[j].date.indexOf('/');
        var second = data[j].date.substring(first + 1).indexOf('/');
        mm = data[j].date.substr(0, first);
        if (+mm < 10) {
            mm = '0' + mm;
        }
        dd = data[j].date.substr(first + 1, second);
        if (dd < 10) {
            dd = '0' + dd;
        }
        yy = data[j].date.substr(first + second + 2, 4);
        first = data[j].date.indexOf(',');
        second = data[j].date.indexOf(':');
        hh = data[j].date.substring(+first + 2, second);
        var space = data[j].date.indexOf(' ', 13)
        if (data[j].date.substr(space + 1, 2) == 'PM') {
            hh = +hh + 12;
        }
        min = data[j].date.substr(second + 1, 2);
        if (data[j].status == false) {
            $('table').append("<tr id=\"r" + j + "\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");
        } else $('table').append("<tr id=\"r" + j + "\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i" + j + "title\">" + data[j].title + "</td><td class=\"etitable\" id=\"i" + j + "author\">" + data[j].author + "</td><td>" + dd + "-" + mm + "-" + yy + " " + hh + ":" + min + "</td><td><div class=\"delete\">Удалить</div></td></tr>");

    }
    $('input[type="submit"], #button').click(function (event) {
        if ($('input[name="title"]').val().length == 0) {
            event.preventDefault();
            $('input[name="title"]').addClass('red');
        } else $('input[name="title"]').removeClass('red');
        if ($('input[name="author"').val().length == 0) {
            event.preventDefault();
            $('input[name="author"]').addClass('red');
        } else $('input[name="author"]').removeClass('red');
        if (($('input[name="author"').val().length != 0) && ($('input[name="title"]').val().length != 0)) {
            now=new Date();
            data.push({
                title: $('input[name="title"]').val(),
                author: $('input[name="author"]').val(),
                date: now.toLocaleString(),
                id: +new Date(),
                status: false
            });
            localStorage.data = JSON.stringify(data);
            console.log(typeof data[data.length-1].date);
            console.log(data[data.length-1].status);
            var first = data[j].date.indexOf('/');
            var second = data[j].date.substring(first + 1).indexOf('/');
            mm = data[j].date.substr(0, first);
            if (+mm < 10) {
                mm = '0' + mm;
            }
            dd = data[j].date.substr(first + 1, second);
            if (dd < 10) {
                dd = '0' + dd;
            }
            yy = data[j].date.substr(first + second + 2, 4);
            first = data[j].date.indexOf(',');
            second = data[j].date.indexOf(':');
            hh = data[j].date.substring(+first + 2, second);
            var space = data[j].date.indexOf(' ', 13)
            if (data[j].date.substr(space + 1, 2) == 'PM') {
                hh = +hh + 12;
            }
            min = data[j].date.substr(second + 1, 2);
            if(data[data.length-1].status==false) {
            $('table').append("<tr id=\"r"+(data.length-1)+"\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i"+(data.length-1)+"title\">"+data[data.length-1].title+"</td><td class=\"etitable\" id=\"i"+(data.length-1)+"author\">"+data[length-1].aythor+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            } else {
                $('table').append("<tr id=\"r"+(data.length-1)+"\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i"+(data.length-1)+"title\">"+data[data.length-1].title+"</td><td class=\"etitable\" id=\"i"+(data.length-1)+"author\">"+data[data.length-1].aythor+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            }
        }
    });
    $(function()	{
        var val;
        $('.etitable').dblclick(function(e)	{
            //ловим элемент, по которому кликнули
            var t = e.target || e.srcElement;
            //получаем название тега
            var elm_name = t.tagName.toLowerCase();
            //если это инпут - ничего не делаем
            if(elm_name == 'input')	{return false;}
            val = $(this).html();
            var code = '<input type="text" id="edit" value="'+val+'" />';
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
                location.reload();
                $(this).parent().empty().html(val);
                } else $('#edit').focus();
            });
        });
        $(window).keydown(function(event){
        //ловим событие нажатия клавиши
        if(event.keyCode == 13) {	//если это Enter
            $('#edit').blur();	//снимаем фокус с поля ввода
        }
    });
    $('input[type="checkbox"').dblclick(function(){
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
        location.reload();
    }); 
    $('.delete').click(function () {
        var row_id=$(this).parent().parent().attr('id').substr(1);
        $(this).parent().parent().remove();
        data=JSON.parse(localStorage.data);
        data.splice(row_id, 1);
        localStorage.data = JSON.stringify(data);
    });
});
});
