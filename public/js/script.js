document.addEventListener('DOMContentLoaded', () => {
    const editName = document.getElementById('editName');
    const editPhone = document.getElementById('editPhone');
    const btnDelete = document.getElementById('btnDelete');

    if (btnDelete && editName && editPhone) {
        const disableDeleteBtn = () => {
            btnDelete.disabled = true;
            btnDelete.classList.add('disabled-btn');
        };

        editName.addEventListener('input', disableDeleteBtn);
        editPhone.addEventListener('input', disableDeleteBtn);
    }
});