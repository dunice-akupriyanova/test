$(document).ready(function(){
    var dd, mm, yy, time;
    // localStorage["data[0].title"]='';
    var test=localStorage["data[0].title"];
    if (test.length==0) {
        localStorage["i"]=+0;
        localStorage["data"] = [];
        localStorage["data[0]"] = new Object();
        localStorage["data[0].status"]=false;
    }
    for (var j=0; j<localStorage["i"]; j++){
        mm=localStorage["data["+j+"].date"].substr(4,4);
            switch (mm){
                case 'Jan ': {
                    mm='01';
                    break;
                }
                case 'Feb ': {
                    mm='02';
                    break;
                }
                case 'Mar ': {
                    mm='03';
                    break;
                }
                case 'Apr ': {
                    mm='04';
                    break;
                }
                case 'May ': {
                    mm='05';
                    break;
                }
                case 'June': {
                    mm='06';
                    break;
                }
                case 'July': {
                    mm='07';
                    break;
                }
                case 'Aug ': {
                    mm='08';
                    break;
                }
                case 'Sept': {
                    mm='09';
                    break;
                }
                case 'Oct ': {
                    mm='10';
                    break;
                }
                case 'Nov ': {
                    mm='11';
                    break;
                }
                case 'Dec ': {
                    mm='12';
                    break;
                }
            }
            dd=localStorage["data["+j+"].date"].substr(8,2);
            yy=localStorage["data["+j+"].date"].substr(11,4);
            time=localStorage["data["+j+"].date"].substr(16,5);
            if(localStorage["data["+j+"].status"]=='false') {
            $('table').append("<tr id=\"r"+j+"\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i"+j+"title\">"+localStorage["data["+j+"].title"]+"</td><td class=\"etitable\" id=\"i"+j+"author\">"+localStorage["data["+j+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+time+"</td></tr>");
            } else $('table').append("<tr id=\"r"+j+"\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i"+j+"title\">"+localStorage["data["+j+"].title"]+"</td><td class=\"etitable\" id=\"i"+j+"author\">"+localStorage["data["+j+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+time+"</td></tr>");
            
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
            localStorage["data["+localStorage["i"]+"].date"]=new Date();
            localStorage["data["+localStorage["i"]+"].id"]=+new Date();
            localStorage["data["+localStorage["i"]+"].status"]=$('input[name="status"]').val();
            mm=localStorage["data["+localStorage["i"]+"].date"].substr(4,4);
            switch (mm){
                case 'Jan ': {
                    mm='01';
                    break;
                }
                case 'Feb ': {
                    mm='02';
                    break;
                }
                case 'Mar ': {
                    mm='03';
                    break;
                }
                case 'Apr ': {
                    mm='04';
                    break;
                }
                case 'May ': {
                    mm='05';
                    break;
                }
                case 'June': {
                    mm='06';
                    break;
                }
                case 'July': {
                    mm='07';
                    break;
                }
                case 'Aug ': {
                    mm='08';
                    break;
                }
                case 'Sept': {
                    mm='09';
                    break;
                }
                case 'Oct ': {
                    mm='10';
                    break;
                }
                case 'Nov ': {
                    mm='11';
                    break;
                }
                case 'Dec ': {
                    mm='12';
                    break;
                }
            }
            dd=localStorage["data["+localStorage["i"]+"].date"].substr(8,2);
            yy=localStorage["data["+localStorage["i"]+"].date"].substr(11,4);
            time=localStorage["data["+localStorage["i"]+"].date"].substr(16,5);
            if(localStorage["data["+localStorage["i"]+"].status"]=='false') {
            $('table').append("<tr id=\"r"+localStorage["i"]+"\"><td><input type='checkbox'></td><td class=\"etitable\" id=\"i"+localStorage["i"]+"title\">"+localStorage["data["+localStorage["i"]+"].title"]+"</td><td class=\"etitable\" id=\"i"+localStorage["i"]+"author\">"+localStorage["data["+localStorage["i"]+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+time+"</td></tr>");
            } else $('table').append("<tr id=\"r"+localStorage["i"]+"\"><td><input type='checkbox' checked></td><td class=\"etitable\" id=\"i"+localStorage["i"]+"title\">"+localStorage["data["+localStorage["i"]+"].title"]+"</td><td class=\"etitable\" id=\"i"+localStorage["i"]+"author\">"+localStorage["data["+localStorage["i"]+"].author"]+"</td><td>"+dd+"-"+mm+"-"+yy+" "+time+"</td></tr>");
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
                localStorage["data["+item_id+"].date"]=new Date();
                localStorage["data["+localStorage["i"]+"].id"]=+new Date();
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
        localStorage["data["+row_id+"].date"]=new Date();
        location.reload();
    }); 
    });
});
