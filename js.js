var accesstoken = document.getElementById('AccessToken');
var regex = document.getElementById("regex");
var dieuKien = document.getElementById("dieuKien");
var idGroup = document.getElementById("idGroup");
var idPost = document.getElementById("idPost");
var btnSend = document.getElementById('btnSend');
var log = document.getElementById("textLog");
var logRegex = document.getElementById("textLogRegex");
var checkDK ;
var checkRegex ;
var regexSeach ;
var KEY_GROUPS_POST = "/feed?fields=message,id,link,full_picture,picture,created_time&limit=50";
var KEY_GROUPS_POST_COMMENTS = "/comments?fields=message,id,link,created_time&limit=50";
var arrPost  = [];
function getPostOfGroup(link){
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState  == 4 && this.status == 200 ){
            var json = JSON.parse(this.responseText);
            json.data.forEach(element => {
                arrPost.push(element);
            });
            if(json.paging != undefined){
                if(json.paging.next != undefined){
                    getPostOfGroup(json.paging.next);
                }
            }
            var check2
            if(checkDK != undefined)
                check2 = checkDK.split("|");
            arrPost.forEach(element => {
                var data = "";
                var dataRegex = "";
                var i = 0;
                var i2 =0;
                let m;
                let dontCheck = 0;
                // tìm bằng regex
                if(checkRegex == undefined || checkRegex == ""){
                    dontCheck++;
                }else{
                    while ((m = regexSeach.exec(element.message)) !== null) {
                        // This is necessary to avoid infinite loops with zero-width matches
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        
                        // The result can be accessed through the `m`-variable.
                        m.forEach((match, groupIndex) => {
                            dataRegex+= match+" | ";
                            i2++;
                        });
                    }
                    if(i2>0){
                        logRegex.value = logRegex.value+"\n 🚀Tìm thấy chuỗi: "+dataRegex+" Link Post: https://www.facebook.com/"+element.id+" Message: "+element.message;
                    }
                }
                // tìm bằng chuỗi cố định
                if(check2==undefined || check2.length <= 0 || checkDK == undefined || checkDK == ""){
                    dontCheck++;
                }else{
                    check2.forEach(element2 => {
                        if(element.message.toLowerCase().indexOf(element2.toLowerCase()) != -1){
                            data+=element2+" | ";
                            i++;
                        }
                    });
                    if(i>0){
                        log.value = log.value+"\n 🚀Thỏa mãn: "+data+" Link Post: https://www.facebook.com/"+element.id+" Message: "+element.message;
                    }else{
                        log.value = log.value+"\n ⛔Không thỏa màn: Link post: https://www.facebook.com/"+element.id+" Message: "+element.message;
                    }
    
                }
                // không tìm kiếm
                if(dontCheck == 2){
                    log.value = log.value+"\n 🔥Link Post: https://www.facebook.com/"+element.id+" Message: "+element.message;
                }
            });
        }else{
            console.log("Vui lòng kiển tra lại mạng, accesstoken hoặc id của group");
        }
    };
    xhttp.open("GET",""+link,true);
    xhttp.send();
}

function getCommentOnPost(link){
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState  == 4 && this.status == 200 ){
            let json = JSON.parse(this.responseText);
        }else{
            alert("Vui lòng kiển tra lại mạng, accesstoken hoặc id của post");
        }
    };
    xhttp.open("GET",""+link,true);
    xhttp.send();
}
function getUrl( para, accesstoken)
{
    return "https://graph.facebook.com/v6.0/" + para + "&access_token=" + accesstoken;
}
btnSend.onclick = ()=>{
    checkDK = dieuKien.value+"";
    checkRegex = regex.value+"";
    regexSeach = new RegExp(checkRegex,"gmi");
    var link =getUrl(""+idGroup.value+KEY_GROUPS_POST,accesstoken.value+"")
    getPostOfGroup(link);
}
