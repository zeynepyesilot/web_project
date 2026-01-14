# AcilTakip - Emergency Service Tracking System 🚑

**AcilTakip** is a smart web based application designed to help users find the nearest and most available emergency rooms (ERs) instantly. By analyzing simulated real time density data and geolocation, it provides intelligent routing to minimize waiting times.

## features

* **📍 Live Map Integration:** Interactive map showing user location and nearby hospitals using **Leaflet.js**.
* **Smart Sorting Algorithms:** Sort hospitals by **"Nearest"** (Distance) or **"Least Crowded"** (Density Score).
* **Real-Time Status:** Visual density indicators (🟢 Available, 🟡 Moderate, 🔴 Busy) to help users make quick decisions.
* **Localization:** Full support for **Turkish (TR)** and **English (EN)** with instant language switching.
* **Hospital Views:** Dedicated detail pages showing available medical departments (e.g., Cardiology, Neurology) and distance information.
* **Fully Responsive:** Optimized for mobile and desktop devices using **Bootstrap 5**.

## project structure

* `index.html`: Main landing page with map and list view.
* `details.html`: Dedicated page for displaying specific hospital details.
* `main.js`: Core application logic, map rendering, and event listeners.
* `details.js`: Logic for fetching and displaying detailed hospital information.
* `mockService.js`: Simulates asynchronous backend data fetching (latency & random density generation).
* `hospital.js`: ES6 Class model representing hospital data structure.
* `translations.js`: Dictionary object managing multi-language content.
* `style.css`: Custom CSS for animations, map styling, and specific UI components.

## how to run

This project uses **ES6 Modules** (`type="module"`), so it requires a local server to run correctly (opening the HTML file directly will cause CORS errors).

### recommended method VSCode Live Server

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/zeynepyesilot/web_project.git](https://github.com/zeynepyesilot/web_project.git)
    ```

2.  **Open the project in VS Code:**
    * Launch Visual Studio Code.
    * File > Open Folder > Select the `web_project` folder.

3.  **Install "Live Server" Extension:**
    * Go to the Extensions view in VS Code.
    * Search for **"Live Server"** and install it.

4.  **Run the App:**
    * Right-click on `index.html` in the file explorer.
    * Select **"Open with Live Server"**.
    * The application will automatically open in your default browser at `http://127.0.0.1:5500`.

## gitHub repository
[https://github.com/zeynepyesilot/web_project](https://github.com/zeynepyesilot/web_project)
