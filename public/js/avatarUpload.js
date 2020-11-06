const AvatarUpload = {
    input:"",
    preview: document.querySelector('#avatar-preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target

        AvatarUpload.input = event.target

        if (AvatarUpload.hasLimit(event)) return

        Array.from(fileList).forEach( file => {


            AvatarUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {

                const avatarImage = new Image()
                avatarImage.src = String(reader.result)

                const div = AvatarUpload.getContainer(avatarImage)
                AvatarUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)

            AvatarUpload.input.files = AvatarUpload.getAllFiles()
        })
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = AvatarUpload

        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie somente ${uploadLimit} imagem`)
            event.preventDefault()
            return true
        }

        const avatarDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "avatar-image")
                avatarDiv.push(item)
        })

        const totalImages = fileList.length + avatarDiv.length
        if (totalImages > uploadLimit) {
            alert(`Você atingiu o limite máximo de imagem`)
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        AvatarUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        
        div.classList.add('avatar-image')

        div.onclick = AvatarUpload.removeImage

        div.appendChild(image)

        div.appendChild(AvatarUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removeImage(event) {
        const avatarDiv = event.target.parentNode
        const imagesArray = Array.from(AvatarUpload.preview.children)
        const index = imagesArray.indexOf(avatarDiv)

        AvatarUpload.files.splice(index, 1)
        AvatarUpload.input.files = AvatarUpload.getAllFiles()

        avatarDiv.remove()
    },
    removeOldImage(event) {
        const avatarDiv = event.target.parentNode

        if (avatarDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${avatarDiv.id},`
            }
        }
        avatarDiv.remove()
    }
}