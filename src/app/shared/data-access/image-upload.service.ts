import { Injectable, inject } from "@angular/core";

import { ref } from 'firebase/storage';
import { getDownloadURL, uploadBytesResumable } from "rxfire/storage";
import { exhaustMap, filter } from "rxjs";
import { STORAGE } from "../../app.config";

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    private storage = inject(STORAGE);

    uploadImage(file: File){
        const filePath = `avatars/${file.name}`;
        const fileRef = ref(this.storage, file.name);

        return uploadBytesResumable(fileRef, file).pipe(
            filter((snap) => snap.state === 'success'),
            exhaustMap((snap) => getDownloadURL(fileRef))
        );
    }
}