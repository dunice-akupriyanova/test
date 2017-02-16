$(document).ready(function(){
    var dd, mm, yy, time, hh, min;
    // localStorage["data[0].title"]='';
    var test=localStorage["data[0].title"];
    if (test.length==0) {
        localStorage["i"]=+0;
        localStorage["data"] = [];
        localStorage["data[0]"] = new Object();
        localStorage["data[0].status"]=false;
    }
    for (var j=0; j<localStorage["i"]; j++){
        var first=localStorage["data["+j+"].date"].indexOf('/');
            var second=localStorage["data["+j+"].date"].substring(first+1).indexOf('/');
            mm=localStorage["data["+j+"].date"].substr(0, first);
            if(+mm<10){
                mm='0'+mm;
            }
            dd=localStorage["data["+j+"].date"].substr(first+1,second);
            if (dd<10){
                dd='0'+dd;
            }
            yy=localStorage["data["+j+"].date"].substr(first+second+2,4);
            first=localStorage["data["+j+"].date"].indexOf(',');
            second=localStorage["data["+j+"].date"].indexOf(':');
            hh=localStorage["data["+j+"].date"].substring(+first+2, second);
            var space=localStorage["data["+j+"].date"].indexOf(' ', 13)
            if (localStorage["data["+j+"].date"].substr(space+1, 2)=='PM') {
                hh=+hh+12;
            }
            min=localStorage["data["+j+"].date"].substr(second+1, 2);
            if(localStorage["data["+j+"].status"]=='false') {
            $('table').append("<tr id=\"r"+j+"\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i"+j+"title\">"+localStorage["data["+j+"].title"]+"</td><td class=\"etitable\" id=\"i"+j+"author\">"+localStorage["data["+j+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            } else $('table').append("<tr id=\"r"+j+"\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i"+j+"title\">"+localStorage["data["+j+"].title"]+"</td><td class=\"etitable\" id=\"i"+j+"author\">"+localStorage["data["+j+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            
    }
    $('input[type="submit"], #button').click(function(event) {
        if ($('input[name="title"]').val().length==0) {
            event.preventDefault();
            $('input[name="title"]').addClass('red');
        } else $('input[name="title"]').removeClass('red');
        if ($('input[name="author"').val().length==0) {
            event.preventDefault();
            $('input[name="author"]').addClass('red');
        } else $('input[name="author"]').removeClass('red');
        if (($('input[name="author"').val().length!=0)&&($('input[name="title"]').val().length!=0)){
            localStorage["data["+localStorage["i"]+"].title"]=$('input[name="title"]').val();
            localStorage["data["+localStorage["i"]+"].author"]=$('input[name="author"]').val();
            var now=new Date();
            localStorage["data["+localStorage["i"]+"].date"]=now.toLocaleString();
            localStorage["data["+localStorage["i"]+"].id"]=+new Date();
            localStorage["data["+localStorage["i"]+"].status"]=$('input[name="status"]').val();
            var first=localStorage["data["+localStorage["i"]+"].date"].indexOf('/');
            var second=localStorage["data["+localStorage["i"]+"].date"].substring(first+1).indexOf('/');
            mm=localStorage["data["+localStorage["i"]+"].date"].substr(0, first);
            if(+mm<10){
                mm='0'+mm;
            }
            dd=localStorage["data["+localStorage["i"]+"].date"].substr(first+1,second);
            if (dd<10){
                dd='0'+dd;
            }
            yy=localStorage["data["+localStorage["i"]+"].date"].substr(first+second+2,4);
            first=localStorage["data["+localStorage["i"]+"].date"].indexOf(',');
            second=localStorage["data["+localStorage["i"]+"].date"].indexOf(':');
            hh=localStorage["data["+localStorage["i"]+"].date"].substring(+first+2, second);
            var space=localStorage["data["+localStorage["i"]+"].date"].indexOf(' ', 13)
            if (localStorage["data["+localStorage["i"]+"].date"].substr(space+1, 2)=='PM') {
                hh=+hh+12;
            }
            min=localStorage["data["+localStorage["i"]+"].date"].substr(second+1, 2);
            if(localStorage["data["+localStorage["i"]+"].status"]=='false') {
            $('table').append("<tr id=\"r"+localStorage["i"]+"\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i"+localStorage["i"]+"title\">"+localStorage["data["+localStorage["i"]+"].title"]+"</td><td class=\"etitable\" id=\"i"+localStorage["i"]+"author\">"+localStorage["data["+localStorage["i"]+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            } else $('table').append("<tr id=\"r"+localStorage["i"]+"\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i"+localStorage["i"]+"title\">"+localStorage["data["+localStorage["i"]+"].title"]+"</td><td class=\"etitable\" id=\"i"+localStorage["i"]+"author\">"+localStorage["data["+localStorage["i"]+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+hh+":"+min+"</td><td><div class=\"delete\">Удалить</div></td></tr>");
            localStorage["i"]=+localStorage["i"]+1;
            localStorage["data["+localStorage["i"]+"]"]= new Object();
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
                localStorage["data["+item_id+"]."+item_type]=val;
                var now=new Date();
                localStorage["data["+item_id+"].date"]=now.toLocaleString();
                localStorage["data["+item_id+"].id"]=+new Date();
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
        var row_id=$(this).parent().parent().attr('id').substr(1);
        if(localStorage["data["+row_id+"].status"]=='false') {
        localStorage["data["+row_id+"].status"]=true;
        }
        else localStorage["data["+row_id+"].status"]=false;
        var now=new Date();
        localStorage["data["+row_id+"].date"]=now.toLocaleString();
        location.reload();
    }); 
    });
});