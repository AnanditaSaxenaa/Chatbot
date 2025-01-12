let prompt = document.querySelector("#prompt");
let submitBtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imgBtn = document.querySelector("#image");
let img = document.querySelector("#image img");
let imgInput = imgBtn.querySelector("input");
let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBVETWclX-sGkRMGmRTypssVyX9uRcODYA"

async function generateResponse(aiChatBox){
    let text = aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [{
                "parts":[{"text": user.message},(user.file.data?
                    [{"inline_data":user.file}]:[])]
                }]
        })

    }
    try{
        let response = await fetch(api_url, RequestOption)
        let data = await response.json()
        let apiResponse= data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML = apiResponse
        
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({
            top:chatContainer.scrollHeight, behavior:"smooth"
        })
        img.src=`img.svg`
        img.classList.remove("choose")
        user.file={}

    }
    
}



function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}


function handleChatResponse(userMessage) {
    user.message = userMessage
    let html = `
        <img src="user.png" id="userImage" width="10%">
        <div class="user-chat-area">
            ${user.message}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}
        </div>`;
    let userChatBox = createChatBox(html, "user-chat-box"); // Fix: Add quotes around class name
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({
        top:chatContainer.scrollHeight, behavior:"smooth"
    })
    setTimeout(()=>{
        let html = `<img src="bot.png" id="aiImage" width="10%">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
        </div>`
        let aiChatBox=createChatBox(html,"ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    },600)
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { // Fix: Use === for comparison
        handleChatResponse(prompt.value);
        prompt.value = ""; // Fix: Clear input field
    }
    
});
submitBtn.addEventListener("click",()=>{
    handleChatResponse(prompt.value);
    prompt.value = "";
})
imgInput.addEventListener("change",()=>{
    const file=imgInput.files[0]
    if(!file) return
    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64tring=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64tring
        }
        img.src=`data:${user.file.mime_type};base64,${user.file.data}`
        img.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})

imgBtn.addEventListener("click",()=>{
    imgBtn.querySelector("input").click()
})