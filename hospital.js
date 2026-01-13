export class Hospital {
    constructor(id, name, lat, lng, currentDensity, distanceKm) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.currentDensity = currentDensity; 
        this.distanceKm = distanceKm;
        
        // başlangıç durumunu hesapla
        this.updateStatus();
    }

    updateStatus() {
        if (this.currentDensity < 40) {
            this.statusColor = "success"; // yeşil
            this.statusText = "Müsait";
        } else if (this.currentDensity < 75) {
            this.statusColor = "warning"; // sarı
            this.statusText = "Orta Yoğun";
        } else {
            this.statusColor = "danger"; // kırmızı
            this.statusText = "Çok Yoğun";
        }
    }

    getEstimatedWaitTime() {
        // yoğunluk arttıkça bekleme süresi artar 
        const waitTime = Math.round(this.currentDensity * 1.5); 
        return `${waitTime} dk`;
    }
}