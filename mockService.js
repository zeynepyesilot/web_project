import { Hospital } from './hospital.js';

const hospitalDatabase = [
    { 
        name: "Bakırköy Sadi Konuk E.A.H", 
        lat: 40.993808, lng: 28.865058,
        departments: ["dept_emergency", "dept_cardiology", "dept_neurology", "dept_surgery", "dept_orthopedics"] 
    },
    { 
        name: "İstanbul Eğitim ve Araştırma (Samatya)", 
        lat: 41.002631, lng: 28.937124,
        departments: ["dept_emergency", "dept_internal", "dept_orthopedics", "dept_ent", "dept_surgery"]
    },
    { 
        name: "Koç Üniversitesi Hastanesi", 
        lat: 41.021067, lng: 28.916568,
        departments: ["dept_emergency", "dept_pediatrics", "dept_cardiology", "dept_neurology", "dept_internal"]
    },
    { 
        name: "Cerrahpaşa Tıp Fakültesi", 
        lat: 41.006255, lng: 28.939979,
        departments: ["dept_emergency", "dept_cardiology", "dept_neurology", "dept_orthopedics", "dept_pediatrics", "dept_internal", "dept_surgery"]
    },
    { 
        name: "Haseki Eğitim ve Araştırma", 
        lat: 41.022785, lng: 28.944505,
        departments: [] 
    },
    { 
        name: "Bağcılar Eğitim ve Araştırma", 
        lat: 41.030609, lng: 28.869625,
        departments: ["dept_emergency", "dept_pediatrics", "dept_neurology", "dept_surgery"]
    },
    { 
        name: "Medipol Mega Üniversite", 
        lat: 41.058135, lng: 28.843275,
        departments: ["dept_emergency", "dept_cardiology", "dept_surgery", "dept_internal", "dept_ent", "dept_pediatrics"]
    },
    { 
        name: "Memorial Bahçelievler", 
        lat: 40.992998, lng: 28.852801,
        departments: ["dept_emergency", "dept_cardiology", "dept_orthopedics", "dept_ent"]
    },
    { 
        name: "Acıbadem Bakırköy", 
        lat: 40.977490, lng: 28.872234,
        departments: ["dept_emergency", "dept_pediatrics", "dept_ent", "dept_internal"]
    },
    { 
        name: "Medical Park Bahçelievler", 
        lat: 40.995804, lng: 28.863447,
        departments: ["dept_emergency", "dept_internal", "dept_surgery", "dept_cardiology"]
    }
];

export class MockService {
    static fetchHospitals() {
        return new Promise((resolve) => {
            console.log("Veriler veritabanından çekiliyor...");
            
            setTimeout(() => {
                const data = hospitalDatabase.map((h, index) => {
                    // yoğunluk simülasyonu
                    const density = Math.floor(Math.random() * 100); 
                    
                    // mesafe hesaplaması simülasyonu, main.js eziyor
                    const dist = (Math.random() * 15 + 1).toFixed(1);

                    // nesneyi oluştur, hospital class kullanıyor
                    const newHosp = new Hospital(index + 1, h.name, h.lat, h.lng, density, dist);
                    
                    //  orijinal departman listesi nesneye aktarılıyor
                    newHosp.departments = h.departments; 
                    
                    return newHosp;
                });
                
                resolve(data);
            }, 500); 
        });
    }
}  // data bir Hospital nesneleri dizisi oluyor; 
// bu dizi daha sonra resolve(data) ile Promise üzerinden döndürülüyor.
//Gerçek veritabanı yokken sahte (mock) veri oluşturmak ve 
// uygulamanın diğer kısımlarının (ör. renderHospitals) çalışmasını sağlamak için.