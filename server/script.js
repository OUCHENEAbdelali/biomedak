function openOT(id) {
    document.getElementById('modalOT').style.display = 'block';
    document.getElementById('modal_eq_id').value = id;
}

// Fermer la modal si on clique en dehors
window.onclick = function(event) {
    var modal = document.getElementById('modalOT');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}