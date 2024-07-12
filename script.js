
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calculForm").addEventListener("submit", function(event) {
        event.preventDefault();
        validateAndDisplayContactForm();
    });
/*
    document.getElementById("ouiButton").addEventListener("click", function() {
        document.getElementById("userChoice").value = "Oui";
        document.getElementById("responseMessage").textContent = "Un conseiller va vous recontacter dans les plus brefs délais.";
        document.getElementById("responseMessage").classList.remove("hidden");
        submitData();
    });

    document.getElementById("nonButton").addEventListener("click", function() {
        document.getElementById("userChoice").value = "Non";
        document.getElementById("responseMessage").textContent = "Merci pour votre intérêt. N'hésitez pas à nous contacter si vous avez des questions.";
        document.getElementById("responseMessage").classList.remove("hidden");
        submitData();
    });*/
});

const mySlider = document.getElementById("nbJours");
const sliderValue = document.getElementById("nbJoursValue");

mySlider.addEventListener("input", function() {
    updateSliderValue(this.value);
});

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
        alert("Veuillez entrer un nombre de passages par jour valide entre 50 et 2000.");
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
    console.log("Début du calcul...");

    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const groupementSelect = document.getElementById('groupement');
    const consentCheckbox = document.getElementById('consentCheckbox');
    
    // Ajout de vérifications pour chaque élément
    const nbPassagesInput = document.getElementById('nbPassages');
    if (!nbPassagesInput) {
        console.error("L'élément nbPassages n'existe pas.");
        return;
    }
    const nbPassages = parseInt(nbPassagesInput.value, 10);
    
    const nbJoursInput = document.getElementById('nbJours');
    if (!nbJoursInput) {
        console.error("L'élément nbJours n'existe pas.");
        return;
    }
    const nbJours = parseInt(nbJoursInput.value, 10);

    const typeDispositifSelect = document.getElementById('typeDispositif');
    if (!typeDispositifSelect) {
        console.error("L'élément typeDispositif n'existe pas.");
        return;
    }
    const typeDispositif = typeDispositifSelect.value;

    const dureeEngagementSelect = document.getElementById('dureeEngagement');
    if (!dureeEngagementSelect) {
        console.error("L'élément dureeEngagement n'existe pas.");
        return;
    }
    const dureeEngagement = parseInt(dureeEngagementSelect.value);

    console.log(`nbPassages: ${nbPassages}, nbJours: ${nbJours}, typeDispositif: ${typeDispositif}, dureeEngagement: ${dureeEngagement}`);
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

    // Vérifier les autres champs de contact
    if (!nom || !prenom || !email || !telephone ) {
        alert('Veuillez remplir tous les champs de contact.');
        return; // Arrêter l'exécution si les champs ne sont pas remplis
    }

    if (!groupementSelect.value) {
                alert('Veuillez sélectionner un groupement.');
                groupementSelect.focus();
                return false;
            }
   if (!consentCheckbox.checked) {
                alert('Veuillez accepter que vos informations soient transmises à Tessan.');
                consentCheckbox.focus();
                return false;
      }
     submitData();
    // Calculer et afficher les résultats
    let pourcentageConversion = 1;
    pourcentageConversion *= {
        'console': 0.015,
        'borne': 0.0175,
        'cabine': 0.0225
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
    const tcParMois = Math.ceil(conversions * nbJours);
    
    // Nouveau calcul pour tcParMoisRentable
    const tcParMoisRentable = Math.ceil(coutInstallation / 20);

    document.getElementById('caResultat').textContent = `${caCinqAns.toLocaleString('fr-FR')} € (${typeDispositifSelect.options[typeDispositifSelect.selectedIndex].text})`;
    document.getElementById('tcParMois').textContent = `${tcParMois.toLocaleString('fr-FR')} téléconsultations par mois (${typeDispositifSelect.options[typeDispositifSelect.selectedIndex].text})`;
    document.getElementById('teleconsultationsRentable').textContent = `${tcParMoisRentable} téléconsultations par mois`;

    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('disclaimer').classList.remove('hidden');

    // Masquer l'élément form-note
    document.getElementById('form-note').classList.add('hidden');
     
}

function submitData() {
    const dateSoumission = new Date().toLocaleDateString('fr-FR');
    const data = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        groupement: document.getElementById('groupement').value,
        nbPassages: parseInt(document.getElementById('nbPassages').value),
        nbJours: parseInt(document.getElementById('nbJours').value),
        typeDispositif: document.getElementById('typeDispositif').value,
        dureeEngagement: parseInt(document.getElementById('dureeEngagement').value),
        dateSoumission: dateSoumission // Utilisation de la variable explicite
       /* userChoice: document.getElementById('userChoice').value*/
    };
 console.log("Données à soumettre:", data); // Ajouter un log pour vérifier les données soumises

    submitToGoogleSheets(data);
}

function submitToGoogleSheets(data) {
    const url = "https://script.google.com/macros/s/AKfycbxYrvSsB1cVd7naI7DIePRyR6bKTyFQVlSSbOyZIFcdlHWn9MiJsBhdj1f80f62oqehRw/exec"; // Remplacez par l'URL de votre script Google Apps

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
        if (!response.ok) {
            console.error("Erreur lors de la soumission des données.");
        }
    }).catch(error => {
        console.error("Erreur de soumission : ", error);
    });
}

function afficherResultats() {
    console.log("Affichage des résultats...");
    calculer();
   
    
}
