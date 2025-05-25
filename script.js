let currentPageUrl = 'https://swapi.tech/api/people/';

// Ao acessar a página:
// - Tentará carregar e mostrar os 10 primeiros personagens
// - Armazenar os botões "Anterior" e "Próximo" e monitorar seus clicks
window.onload = async () => {
    try {
        // Carregar personagens
        await loadCharacters(currentPageUrl)
    } catch (error) {
        // Mostrar erro
        console.log(error);
        alert('Erro ao carregar cards');
    }
    
    // Armazenar os botões
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    // Monitorar clicks
    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};

// Mostra cads de 10 personagens e suas informações a 
// clicar no card
async function loadCharacters(url) {
    // Armazena e limpa a tag 
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    try {
        // Recebe os personagens e os trata com json
        const response = await fetch(url);
        const responseJson = await response.json();

        // Itera sobre cada personagem, com "character" contendo
        // um novo objeto do array "results" a cada iteração
        responseJson.results.forEach((character) => {

            // INÍCIO CARD

            // Cria um card para cada personagem, adicionando uma class compartilhada e 
            // a image do seu respectivo personagens com base no id (url transformada)
            const card = document.createElement('div')
            card.style.backgroundImage = `url('./assets/img/people/${character.url.replace(/\D/g, "")}.jpg')`;
            card.className = 'cards';

            // Cria uma div para o nome do personagem
            const characterNameBg = document.createElement('div');
            characterNameBg.className = 'character-name-bg';

            // Cria um span que recebe o nome do personagem
            const charactername = document.createElement('span');
            charactername.className = 'character-name'
            charactername.innerText =  `${character.name}`

            // Relaciona o span 'character-name' como tag filha da div 'character-name-bg'
            characterNameBg.appendChild(charactername);
            // Relaciona a div 'character-name-bg' como filha da div 'cards
            card.appendChild(characterNameBg);

            // FIM CARD
            
            // INICIO MODAL

            // A clicar em card executa a função seguinte
            card.onclick = () => {
                // Contém o modal-container e o torna visível
                const modalContainer = document.getElementById('modal-container');
                modalContainer.style.visibility = 'visible';

                // Contém o modal-content e limpa seu conteúdo
                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = ''

                // Cria uma div que recebe a imagem do personagem com base no id (url transformada)
                const characterImage = document.createElement('div');
                characterImage.style.backgroundImage = `url('./assets/img/people/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = 'character-image';

                // Cria um span que recebe o nome do personagem
                const name = document.createElement('span');
                name.className = 'character-details'
                name.innerText = `Nome: ${character.name}`

                // Cria um span que recebe a idade do personagem convertida
                const birthYear = document.createElement('span');
                birthYear.className = 'character-details'
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                // Cria um span que recebe a altura do personagem convertida
                const height = document.createElement('span');
                height.className = 'character-details'
                height.innerText = `Altura: ${convertHeight(character.height)}`

                // Cria um span que recebe o peso do personagem convertido
                const mass = document.createElement('span');
                mass.className = 'character-details'
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                // Cria um span que recebe a cor dos olhos do personagem convertida
                const eyerColor = document.createElement('span');
                eyerColor.className = 'character-details'
                eyerColor.innerText = `Cor dos olhos: ${convertEyerColor(character.eye_color)}`

                // Relaciona a div e os spans anterior como sendo tags filha do modal
                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(birthYear);
                modalContent.appendChild(height);
                modalContent.appendChild(mass);
                modalContent.appendChild(eyerColor);

                // Esconde o modal
                modalContainer.onclick = () => {
                    // A deixa invisivel
                    const modal = document.getElementById('modal-container')
                    modal.style.visibility = 'hidden'
                }
            }

            // Relaciona a div card como tag filha da div mainContent
            mainContent.appendChild(card);
            // FIM MODAL
        });

        // Armazena os botões de anterio e voltar
        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        // Quando não existir uma próxima página irá desabilitar o botão
        nextButton.disabled = !responseJson.next;

        // Quando não existir um página anterior irá desabilitar o botão
        backButton.disabled = !responseJson.previous;
        
        // Se existir uma página anterior mostra o botão, se não, esconde
        backButton.style.visibility = responseJson.previous? "visible" : "hidden";

        // Se existir uma página seguinte mostra o botão, se não, esconde
        nextButton.style.visibility = responseJson.next? "visible" : "hidden";

        // Repassa a url recebida como sendo a atual
        currentPageUrl = url
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar personagens')
    }
}

// Avança página, mais 10 personagens
async function loadNextPage() {
    // Se não existir url não faça nada
    if (!currentPageUrl) return;

    try {
        // Receba a url atual
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        // Carrega os personagens do próximo objeto
        await loadCharacters(responseJson.next)
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

// Volta página, os 10 personagens anteriores
async function loadPreviousPage() {
    // Se não existir url não faça nada
    if (!currentPageUrl) return;

    try {
        // Receba a url atual
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        // Carrega os personagens do objeto anterior
        await loadCharacters(responseJson.previous)
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

// Converte a data de nascimento 'unknown' para 'desconhecida
function convertBirthYear(birthYear) {
    if (birthYear === 'unknown') {
        return 'desconhecido'
    }

    return birthYear
}

// Converte a altura em duas casas decimais
function convertHeight(height) {
    if (height === 'unknown') {
        return 'desconhecida'
    }

    return (height / 100).toFixed(2);
}

// Converte o peso para kg
function convertMass(mass) {
    if (mass === 'unknown') {
        return 'desconhecido'
    }

    return `${mass} kg`
}

// Converte a cor dos olhos
function convertEyerColor(eyerColor) {
    const cores = {
        blue: 'azul',
        brown: 'castanho',
        green: 'verde',
        yellow: 'amarelo',
        black: 'preto',
        white: 'branco',
        pink: 'rosa',
        red: 'vermelho',
        orange: 'laranja',
        hazel: 'avela',
        unknown: 'desconhecida'
    };

    return cores[eyerColor.toLowerCase()] || eyerColor
}