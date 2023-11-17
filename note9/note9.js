function loadSpecifications(specs) {
    const specsList = document.querySelector('.specs ul');
  
    specsList.innerHTML = '';
  
    specs.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = `${spec.name}: ${spec.value}`;
      specsList.appendChild(li);
    });
  }
  
  async function fetchFileList(folderPath) {
    try {
      const response = await fetch(folderPath);
      if (!response.ok) {
        throw new Error(`Error fetching file list: ${response.statusText}`);
      }
      const fileListText = await response.text();
  
      const jsonFileLinks = Array.from(
        fileListText.matchAll(/<a href="([^"]+\.json)">/g),
        match => match[1]
      );
  
      console.log('JSON Files:', jsonFileLinks);
  
      return jsonFileLinks;
    } catch (error) {
      console.error('Error fetching file list:', error);
      return [];
    }
  }
  
  async function loadROMs() {
    const romsContainer = document.querySelector('.roms');
  
    romsContainer.innerHTML = '';
  
    try {
        const romFiles = await fetchFileList('./roms', '.json');
        console.log('ROM Files:', romFiles);
        
        for (const romFileName of romFiles) {
          const romResponse = await fetch(`./roms/${romFileName}`);
          if (!romResponse.ok) {
            console.error(`Error loading ROM file (${romFileName}): ${romResponse.statusText}`);
            continue;
          }
        
          const romData = await romResponse.json();
  
        const romBox = document.createElement('div');
        romBox.classList.add('rom-box');
  
        const romHeaderPhoto = document.createElement('img');
        romHeaderPhoto.src = romData.headerPhoto;
        romHeaderPhoto.alt = romData.name;
  
        const romName = document.createElement('h3');
        romName.textContent = romData.name;
  
        const romDescription = document.createElement('p');
        romDescription.textContent = romData.description;
  
        const romButtons = document.createElement('div');
        romData.buttons.forEach(button => {
          const buttonElement = document.createElement('a');
          buttonElement.href = button.link;
          buttonElement.textContent = button.text;
          buttonElement.classList.add('rom-button');
          romButtons.appendChild(buttonElement);
        });
  
        romBox.appendChild(romHeaderPhoto);
        romBox.appendChild(romName);
        romBox.appendChild(romDescription);
        romBox.appendChild(romButtons);
  
        romsContainer.appendChild(romBox);
      }
    } catch (error) {
      console.error('Error loading ROMs:', error);
    }
  }
  
  async function fetchROMsList() {
    try {
      const response = await fetch('./roms/roms.json');
      if (!response.ok) {
        throw new Error(`Error fetching ROMs list: ${response.statusText}`);
      }
      const romsList = await response.json();
      return romsList;
    } catch (error) {
      console.error('Error fetching ROMs list:', error);
      return [];
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetch('./specs.json')
      .then(response => response.json())
      .then(specificationsData => {
        loadSpecifications(specificationsData);
      })
      .catch(error => console.error('Error loading specifications:', error));
  
    loadROMs();
  });
  