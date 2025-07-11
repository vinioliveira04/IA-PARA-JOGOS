const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) =>{
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
        ## Especialidade
        Voce é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Voce deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

        ##Regras
        -Se voce não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        -Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        -Considere a data atual ${new Date().toLocaleDateString()}
        -Faça pesquisas atualizadas sobre o patch aqtual, baseado na datab atual, para dar uma resposta coerente.
        -Nunca responda itens que voce não tenha certeza de que existe no patch atual.

        ##Resposta
        Economize na resposta, seja direto e responda no máximo 500 caracteres
        responda em markdown
        Não precisa fazer saudação ou despedida apenas responda

        ##Exemplo de resposta
        pergunta do usuário: Melhor build rengar jungle
        resposta: A build mais atual é: \n\n **Itens:** coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n
        ___
        Aqui está a pergunta do usuário: ${question}

    `
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools =[{
        google_search:{}
    }]

    //chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}
//AIzaSyDLx0YsswgkJHA6dIt5Os3bUXZ5-NNy1bQ
const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == ''|| game =='' || question == '') {
        alert ('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add = 'loading'

    try {
        //perguntar para IA
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = 
        markdownToHTML(text)
        aiResponse.classList.remove('hidden')

    } catch(error) {

        console.log('Erro:', error)

    }finally{
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove = ('loading')
    }

}
form.addEventListener('submit', enviarFormulario)