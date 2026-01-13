import { MockService } from './mockService.js';
import { translations } from './translations.js';

// URL'den ID ve Dil bilgisini al
function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id')),
        lang: params.get('lang') || 'tr' // dil yoksa tr varsayıyoruz
    };
}

async function initDetails() {
    const { id, lang } = getParams();

    // id yoksa anasayfaya at
    if (!id) {
        window.location.href = 'index.html'; 
        return;
    }

    // sözlüğü seç (tr veya en)
    const t = translations[lang] || translations['tr'];

    // htmldeki sabit yazıları listeye dön vs  çevir
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (t[key]) el.textContent = t[key];
    });

    // verileri çek
    const allHospitals = await MockService.fetchHospitals();
    
    // hastaneyi bul
    const hospital = allHospitals.find(h => h.id === id);

    if (hospital) {
        renderDetail(hospital, t);
    } else {
        document.getElementById('detail-name').innerText = t.err_not_found;
    }
}

function renderDetail(hospital, t) {
    // isim
    document.getElementById('detail-name').textContent = hospital.name;
    
    // mesafe
    document.getElementById('detail-distance').textContent = `${t.est_distance}: ${hospital.distanceKm} km`;

    // bölümleri Listele
    const listBody = document.getElementById('detail-list');
    listBody.innerHTML = ''; 

    if (hospital.departments && hospital.departments.length > 0) {
        hospital.departments.forEach(deptKey => {
            // bölüm adını sözlükten al
            const deptName = t[deptKey] || deptKey;
            
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center py-3';
            li.innerHTML = `<i class="ri-checkbox-circle-fill text-success fs-4 me-3"></i> <span class="fs-5">${deptName}</span>`;
            
            listBody.appendChild(li);
        });
    } else {
        // bilgi yok yazısı
        listBody.innerHTML = `<li class="list-group-item text-muted">${t.no_info}</li>`;
    }
}

// sayfa hazır olunca başlat
document.addEventListener('DOMContentLoaded', initDetails);