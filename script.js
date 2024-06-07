
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calculForm").addEventListener("submit", function(event) {
        event.preventDefault();
        // Appel de la fonction de calcul et validation
        validateAndDisplayContactForm();
    });
});

const mySlider = document.getElementById("nbJours");
const sliderValue = document.getElementById("nbJoursValue");

function updateSliderValue(value) {
    let valPercent = (value - mySlider.min) / (mySlider.max - mySlider.min) * 100;
    mySlider.style.background = `linear-gradient(to right, #3264fe ${valPercent}%, #d5d5d5 ${valPercent}%)`;
    sliderValue.textContent = value;
}

function validateAndDisplayContactForm() {
    if (validateInputs()) { // Si les entrées sont valides
        displayContactForm(); // Affichez le formulaire de contact
    }
}

function validateInputs() {
    const nbPassagesInput = document.getElementById('nbPassages');
    const nbJoursInput = document.getElementById('nbJours');
    const typeDispositifInput = document.getElementById('typeDispositif');
    const dureeEngagementInput = document.getElementById('dureeEngagement');

    const nbPassages = parseInt(nbPassagesInput.value, 10);
    const nbJours = parseInt(nbJoursInput.value, 10);

    if (isNaN(nbPassages) || nbPassages < 50 || nbPassages > 2000) {
        alert("Veuillez entrer un nombre de passages par jour valide entre 1 et 2000.");
        nbPassagesInput.focus();
        return false;
    } else if (isNaN(nbJours) || nbJours < 1 || nbJours > 31) {
        alert("Veuillez entrer un nombre de jours ouverts par mois valide entre 1 et 31.");
        nbJoursInput.focus();
        return false;
    } else if (!typeDispositifInput.value) {
        alert("Veuillez sélectionner un type de dispositif.");
        typeDispositifInput.focus();
        return false;
    } else if (!dureeEngagementInput.value) {
        alert("Veuillez sélectionner une durée d'engagement.");
        dureeEngagementInput.focus();
        return false;
    }

    return true;
}

function displayContactForm() {
    document.getElementById('initialInputs').classList.add('hidden');
    document.getElementById('contactForm').classList.remove('hidden');
}

document.getElementById('typeDispositif').addEventListener('change', function() {
    const typeDispositif = this.value;
    const dureeEngagementSelect = document.getElementById('dureeEngagement');
    
    if (typeDispositif === 'console') {
        dureeEngagementSelect.value = '60';
        dureeEngagementSelect.disabled = true; // Désactiver le choix pour la durée d'engagement
    } else {
        dureeEngagementSelect.disabled = false; // Réactiver le choix pour les autres options
    }
});

function calculer() {
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
   

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^(?:(?:\+33|0)\s?\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}|\+33\s?\d{9}|0\d{9})$/;

    if (!emailPattern.test(email)) {
        alert('Veuillez entrer une adresse email valide. Exemple: utilisateur@domaine.com');
        return;
    }

    if (!phonePattern.test(telephone)) {
        alert('Veuillez entrer un numéro de téléphone valide.');
        return;
    }

    if (!nom || !prenom || !email || !telephone) {
        alert('Veuillez remplir tous les champs de contact.');
        return; // Arrêter l'exécution si les champs ne sont pas remplis
    }

    // Calculer et afficher les résultats
    const nbPassages = parseInt(document.getElementById('nbPassages').value);
    const nbJours = parseInt(document.getElementById('nbJours').value);
    const typeDispositifSelect = document.getElementById('typeDispositif');
    const typeDispositif = typeDispositifSelect.value;
    const dispositifText = typeDispositifSelect.options[typeDispositifSelect.selectedIndex].text;
    const dureeEngagement = parseInt(document.getElementById('dureeEngagement').value);

    let pourcentageConversion = 1;
  

    pourcentageConversion *= {
        'console': 0.01,
        'borne': 0.02,
        'cabine': 0.03
    }[typeDispositif];

    let coutInstallation = 0;
    switch(typeDispositif) {
        case "console":
            coutInstallation = 99;
            break;
        case "borne":
            coutInstallation = dureeEngagement === 60 ? 279 : 229;
            break;
        case "cabine":
            coutInstallation = dureeEngagement === 60 ? 579 : 489;
            break;
    }

    const conversions = pourcentageConversion * nbPassages;
    const caAnnuel = (conversions * 20 * nbJours * 12) + 750;
    let caCinqAns;

    if (dureeEngagement === 60) {
        caCinqAns = caAnnuel * 5 + 1225;
    } else if (dureeEngagement === 72) {
        caCinqAns = caAnnuel * 6 + 1225;
    }

    const roiCinqAns = caCinqAns - (coutInstallation * dureeEngagement + 250);
    const montantParJour = conversions * 20; // Montant perçu par jour
    const seuilRentabilite = Math.ceil((roiCinqAns / (60 * nbJours) / 20));
    const tcParMoisRentable = Math.ceil((roiCinqAns / dureeEngagement) / (20 * nbJours));

    if (roiCinqAns > 0) {
        const rentableMessage = document.getElementById('rentableMessage');
        rentableMessage.style.display = 'block';
        rentableMessage.textContent = "Votre simulation";
        rentableMessage.className = 'rentableTitle';
        afficherResultats();
        document.getElementById('form-note').style.display = 'none';
    } else {
        document.getElementById('rentableMessage').style.display = 'none';
        document.getElementById('detailsAvantages').style.display = 'none';
    }

    document.getElementById('caResultat').textContent = `${caCinqAns.toLocaleString('fr-FR')} € (${dispositifText})`;
    document.getElementById('montantParJour').textContent = `${montantParJour.toLocaleString('fr-FR')} €  (${dispositifText})`;
    document.getElementById('teleconsultationsRentable').textContent = `${tcParMoisRentable} téléconsultations par mois`;

    // Préparation des données à envoyer
    const data = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        groupement: document.getElementById('groupement').value,
        nbPassages: nbPassages,
        nbJours: nbJours,
        typeDispositif: typeDispositif,
        desertMedical: document.getElementById('desertMedical').value,
        dureeEngagement: dureeEngagement
    };

    submitToGoogleSheets(data);

    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
}

function submitToGoogleSheets(data) {
    const url = "https://script.google.com/macros/s/AKfycbwZEKcsTMgDXeH5ftR0cdQ_UMpJYt1bmMFYA0oUy_TydAX2QTnxxJN-x5-peuCITolu/exec"; // Remplacez par l'URL de votre script Google Apps

    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    fetch(url, {
        method: "POST",
        body: formData
    }).then(response => {
        if (response.ok) {
            alert("Données soumises avec succès !");
        } else {
            alert("Erreur lors de la soumission des données.");
        }
    }).catch(error => {
        console.error("Erreur de soumission : ", error);
        alert("Erreur lors de la soumission des données.");
    });
}

function afficherResultats() {
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    const disclaimer = document.getElementById('disclaimer');
    if (!disclaimer) {
        const resultsContainer = document.getElementById('results');
        const disclaimerElement = document.createElement('p');
        disclaimerElement.setAttribute('id', 'disclaimer');
        disclaimerElement.style.fontStyle = 'italic';
        disclaimerElement.style.textAlign = 'center';
        disclaimerElement.style.marginTop = '20px';
        disclaimerElement.style.fontSize = '0.6em'; 
        disclaimerElement.textContent = 'Les résultats présentés sont des estimations basées sur des hypothèses actuelles concernant l\'utilisation de nos dispositifs et ne garantissent pas les performances futures.';
        resultsContainer.appendChild(disclaimerElement);
    }
}
