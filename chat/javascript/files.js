export function createFileHolder(file){
    let userArea = document.querySelector('.user-area');
    let fileHolder = document.createElement('div');
    fileHolder.classList.add('file-holder');
    let Icon = document.createElement("div");
    Icon.classList.add('big-icon', "file-pdf");
    let name = file.name;
    let fileLabelName = document.createElement('h1');
    fileLabelName.textContent = name;
    fileHolder.appendChild(Icon);
    fileHolder.appendChild(fileLabelName);
    let extension = name.split('.').pop();
    userArea.insertBefore(fileHolder, userArea.firstElementChild);
}

export function deleteFileHolder(file){
    let fileHolder = document.querySelector('.file-holder');
    fileHolder.remove();
}