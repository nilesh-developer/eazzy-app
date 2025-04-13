const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const REDIRECT_URL = "https://eazzy.store" // https://linktr.ee/instantgyyan

// // Google Drive Direct Download Link (Replace FILE_ID)
// const EAZZY_GOOGLE_DRIVE_FILE_ID = `1WG6BcYbVRb_B_BZw5tEZ-8AR1GbIY_6v`
// const EAZZY_BUSINESS_GOOGLE_DRIVE_FILE_ID = `1WBUyC3nmxI-AgpqfqmK51rApscOEcHMo`

// const EAZZY_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${EAZZY_GOOGLE_DRIVE_FILE_ID}`
// const EAZZY_BUSINESS_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${EAZZY_BUSINESS_GOOGLE_DRIVE_FILE_ID}`

// // Route to redirect to Google Drive download link
// app.get("/eazzy-app/download", (req, res) => {
//     res.redirect(EAZZY_DOWNLOAD_URL);
// });

// app.get("/eazzy-business-app/download", (req, res) => {
//     res.redirect(EAZZY_BUSINESS_DOWNLOAD_URL);
// });

app.get("/", (req,res) => {
    res.send("Eazzy App");
})

app.get("/eazzy-app/download", (req, res) => {
    // res.redirect("https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk");
    res.send(`
        <html>
            <head>
                <script>
                    window.location.href = "https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk";
                    setTimeout(() => { window.location.href = "${REDIRECT_URL}"; }, 5000);
                </script>
            </head>
            <body>
                <p>Your download is starting... If not, <a href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk">click here</a>.</p>
            </body>
        </html>
    `);
});

app.get("/eazzy-business-app/download", (req, res) => {
    // res.redirect("https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk");
    res.send(`
        <html>
            <head>
                <script>
                    window.location.href = "https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk";
                    setTimeout(() => { window.location.href = "${REDIRECT_URL}"; }, 5000);
                </script>
            </head>
            <body>
                <p>Your download is starting... If not, <a href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk">click here</a>.</p>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
