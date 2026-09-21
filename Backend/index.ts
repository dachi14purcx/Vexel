import 'dotenv/config'
import { app } from "./src/server.js";

const port = 8000;

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
})