let urlExecute = "https://codequotient.com/api/executeCode/";
let urlResult = "https://codequotient.com/api/codeResult/";
let editor = document.querySelector("#editor");
let result = document.querySelector("#result");
let currLang=0;

let langs = {
    0:"Python",
    4:"JavaScript",
    7:"C",
    77:"C++",
    8:"Java"
};

let basicCodes = {
    0:`print("Hi Universe")`,
    4:`console.log("Hi Universe")`,
    7:
`#include<stdio.h>
void main(){
    printf("Hi Universe");
}`,
    77:    
`#include<iostream>
using namespace std;
int main(){
    cout<<"Hi Universe";
    return 0;
}`,
    8:
`public class Main{
    public static void main(String[] args){
        System.out.print("Hi Universe");
    }
}`
}

function reset(){
    editor.value="";
    result.innerText="Output Will be displayed here!";
}

function setLang(num){    
    currLang=num;
    editor.value=basicCodes[num];
    document.querySelector("#navbarDropdown").innerText=langs[num];    
    result.innerText="Output Will be displayed here!";
}

editor.addEventListener("keydown", function(e){
    if(e.key=="Tab"){
        e.preventDefault();
        editor.value+="     ";
    }
});

function executeCode(){    
    let toSend={ "code" : editor.value , langId : `${currLang}` };        
    result.innerText="Waiting for Response...";
    let request = new XMLHttpRequest();
    request.open("POST", urlExecute);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(toSend));

    request.addEventListener("load", function(){
        let rs = JSON.parse(request.responseText);
        
        if(rs["error"]=="Code is null"){
            result.innerText="Error : Code is null.";
        }

        else{            
            let requestSender = setInterval(function(){

                let request = new XMLHttpRequest();                      
                request.open("GET", urlResult+rs["codeId"]);                
                request.send();

                request.addEventListener("load", function(){
                    let response = JSON.parse(request.responseText); 
                    response = JSON.parse(response.data);
                    
                    if(response.status!="Pending"){                        
                        clearInterval(requestSender);                           
                        printInEditor(response);
                    }                                        
                });                
            }, 1000);                                    
        }           
    });

    request.addEventListener("error", function(err){
        console.log("ERROR:", err);        
    });
}

document.querySelector("#runbtn").addEventListener('click',function(){
    executeCode();
});

/*
{ data : {output: '\nOUTPUT:\nhi\n', langid: '0', code: "print('hi')", errors: '', time: ''} }
*/

function printInEditor(data){
    result.innerHTML="";
    
    if(data.errors!=""){
        let errors = document.createElement("p");
        errors.classList.add("text-danger");
        errors.innerText=data.errors;
        result.appendChild(errors);
    }
    
    let output = document.createElement("p");
    output.classList.add("text-info");    
    output.innerText = data.output;
    result.appendChild(output);
}