import { MockService } from '../mockService.js';
import { translations } from '../translations.js';

let globalHospitals = [];
let userLat = 41.0082; 
let userLng = 28.9784;
let mapInstance;
let userMarker;
let currentLang = 'tr'; 

// haritayı başlat
mapInstance = L.map('map').setView([userLat, userLng], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapInstance);

const userIcon = L.divIcon({
    className: 'user-marker',
    html: '<div style="background-color: #0d6efd; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});


function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Selector: CSS seçicisi kullanarak, sayfa içindeki data-lang attribute 'e
    // sahip tüm HTML elementlerini bulur ve bir liste (NodeList) döndürür.
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang'); // getAttribute: HTML'deki anahtarı okur (örn: "hero_title").
        if (t[key]) {
            element.textContent = t[key]; // textContent: HTML elementinin ekranda görünen yazısını değiştirir.
        }
    });

    if (lang === 'tr') {
        document.getElementById('btn-tr').classList.add('active');
        document.getElementById('btn-en').classList.remove('active');
    } else {
        document.getElementById('btn-en').classList.add('active');
        document.getElementById('btn-tr').classList.remove('active');
    } //Mantık Eğer Türkçe seçildiyse TR butonunu boya, EN butonunun boyasını sil

    if (globalHospitals.length > 0) {
        renderHospitals(globalHospitals);
    } // re rendering, amaç: Dil değiştiğinde hastane listesini ve güncellemek

    if (userMarker) {
        userMarker.setPopupContent(t.user_location);
    } // Amaç: Haritadaki mavi noktanın (kullanıcı konumu) üzerindeki baloncuk yazısını güncellemek
}

// mesafe hesaplama
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const airDistance = R * c; 
    const drivingDistance = airDistance * 1.3; 
    return drivingDistance.toFixed(1);
}


function renderHospitals(hospitals) {
    const listBody = document.getElementById('hospital-list-body');
    listBody.innerHTML = ''; 
    // Cleaning: Eski listeyi temizle
    
    const t = translations[currentLang];

    hospitals.forEach(hospital => {
        const realDistance = calculateDistance(userLat, userLng, hospital.lat, hospital.lng);
        hospital.distanceKm = realDistance;

        let statusText = "";
        if (hospital.currentDensity < 40) statusText = t.status_available;
        else if (hospital.currentDensity < 75) statusText = t.status_moderate;
        else statusText = t.status_busy;

        const row = document.createElement('tr');
        
        // detay sayfası için link 
        // bu link details.html sayfasına hastanenin id sini gönderir.
        const detailUrl = `details.html?id=${hospital.id}&lang=${currentLang}`;

        // link senin konumundan hastaneye rota çizer
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;

        row.innerHTML = `
            <td class="fw-bold text-dark d-flex align-items-center">
                ${hospital.name}
                
                <a href="${detailUrl}" class="ms-2 text-decoration-none">
                    <i class="ri-information-fill text-info fs-5" title="Detayları Gör"></i>
                </a>
            </td>

            <td style="width: 25%;">
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar bg-${hospital.statusColor}" 
                         role="progressbar" 
                         style="width: ${hospital.currentDensity}%">
                    </div>
                </div>
                <small class="text-muted">%${hospital.currentDensity}</small>
            </td>
            <td><span class="badge bg-${hospital.statusColor}">${statusText}</span></td>
            
            <td><i class="ri-map-pin-line me-1 text-muted"></i>${realDistance} km</td>
            
            <td><i class="ri-time-line me-1 text-danger"></i>${hospital.getEstimatedWaitTime()}</td>
            
            <td>
                <a href="${mapsUrl}" target="_blank" class="btn btn-sm btn-primary text-white">
                    <i class="ri-direction-fill"></i> ${t.btn_go}
                </a>
            </td>
        `;
        listBody.appendChild(row); 

        L.marker([hospital.lat, hospital.lng])
            .addTo(mapInstance)
            .bindPopup(`<b>${hospital.name}</b><br>${t.th_dist}: ${realDistance} km<br>${t.th_wait}: ${hospital.getEstimatedWaitTime()}`);
    });
}

// uygulamayı başlat
async function initApp() {
    updateLanguage('tr'); 

    globalHospitals = await MockService.fetchHospitals();
//Blocking: Kodun bu satırda durmasını sağlar. 
//MockService.fetchHospitals()işlemi bitip veriler (globalHospitals) gelene kadar bir alt satıra geçmez.
//Eğer await olmasaydı, veri gelmeden haritayı çizmeye çalışırdık ve hata alırdık (Race Condition).

    if (navigator.geolocation) { // 1. Tarayıcı desteği kontrolü
    navigator.geolocation.getCurrentPosition(
        (position) => { // 2. Başarılı Olursa (Success Callback)
            // Konum verilerini al
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            
            // Haritayı oraya odakla (Zoom: 13)
            mapInstance.setView([userLat, userLng], 13);
            
            // Eski marker varsa sil (Duplicate olmasın diye)
            if (userMarker) mapInstance.removeLayer(userMarker);
            
            // Yeni marker ekle
            userMarker = L.marker([userLat, userLng], {icon: userIcon})
                .addTo(mapInstance)
                .bindPopup(translations[currentLang].user_location) // Baloncuk ekle
                .openPopup(); // Baloncuğu aç
                
            // Listeyi BU YENİ KONUMA göre tekrar hesapla ve çiz
            renderHospitals(globalHospitals);
        },
        () => { // 3. Başarısız Olursa (Error Callback)
            // Kullanıcı "İzin Verme" dedi. Varsayılan konumla (İstanbul) listeyi çiz.
            renderHospitals(globalHospitals);
        }
    );
} else {
    // Tarayıcı çok eskiyse ve konum özelliği yoksa
    renderHospitals(globalHospitals);
}
}

document.getElementById('btn-tr').addEventListener('click', () => updateLanguage('tr'));
document.getElementById('btn-en').addEventListener('click', () => updateLanguage('en'));

document.getElementById('btn-sort-distance').addEventListener('click', () => {
    const sorted = [...globalHospitals].sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
//.sort((a, b) => a - b):
//Karşılaştırma fonksiyonudur. Sonuç negatifse a önce gelir, pozitifse b önce gelir.
    renderHospitals(sorted);
});

document.getElementById('btn-sort-density').addEventListener('click', () => {
    const sorted = [...globalHospitals].sort((a, b) => a.currentDensity - b.currentDensity);
    renderHospitals(sorted);
});

document.addEventListener('DOMContentLoaded', initApp);

// bölümleri gösterme fonksiyonu
window.showDepartments = (id) => {
    // window kullandık function yerine çünkü index.html dosyasındaki onclick="showDepartments()" 
    // bu fonksiyona erişebilsin diye
    const hospital = globalHospitals.find(h => h.id === id);
    // Eğer hastane bulunamazsa (hata olursa) işlemi durdur.
    if (!hospital) return;

    // Şu anki dilin çevirilerini al (Türkçe mi İngilizce mi?)
    const t = translations[currentLang];

    // MODAL BAŞLIĞI 
    const modalTitle = document.getElementById('deptModalLabel');
    if (modalTitle) {
        // Başlığa Hastane Adını ve altına küçük puntoyla "Mevcut Bölümler" yazısını ekle.
        // Template Literal (``) kullanılarak HTML kodu oluşturuluyor.
        modalTitle.innerHTML = `${hospital.name} <br> <small class="text-muted fs-6">${t.modal_dept_title}</small>`;
    }

    // BÖLÜM LİSTESİ 
    const listBody = document.getElementById('deptList');
    if (listBody) {
        listBody.innerHTML = ''; // Önceki hastaneden kalan listeyi TEMİZLE (Çok önemli!)

        // Eğer hastanenin bölümleri varsa VE boş değilse:
        if (hospital.departments && hospital.departments.length > 0) {
            // Her bir bölüm için döngü başlat
            hospital.departments.forEach(deptKey => {
                // Bölüm adını çevir (örn: 'dept_cardiology' -> 'Kardiyoloji')
                // Eğer çeviri yoksa kodunu yaz (deptKey)
                const deptName = t[deptKey] || deptKey; 
                
                // Yeni bir liste maddesi (li) oluştur
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex align-items-center'; // Bootstrap sınıfları
                
                // İçine yeşil tik ikonu ve bölüm adını koy
                li.innerHTML = `<i class="ri-checkbox-circle-line text-success me-2"></i> ${deptName}`;
                
                // Listeye ekle (Append)
                listBody.appendChild(li);
            });
        } else {
            // Eğer bölüm bilgisi yoksa "Bilgi Bulunmamaktadır" yaz.
            listBody.innerHTML = `<li class="list-group-item text-muted">${t.no_info}</li>`;
        }
    }

    // PENCEREYİ AÇ 
    const modalElement = document.getElementById('deptModal');
    if (modalElement) {
        // Bootstrap'in Modal özelliğini kullanarak pencereyi oluştur.
        const myModal = new bootstrap.Modal(modalElement);
        // Pencereyi kullanıcıya göster.
        myModal.show();
    } else {
        console.error("Modal bulunamadı! HTML'de id='deptModal' olan div yok.");
    }
};