import { Injectable, inject } from "@angular/core";

import { ref } from 'firebase/storage';
import { STORAGE } from "../../app.config";
import { getDownloadURL, uploadBytesResumable } from "rxfire/storage";
import { switchMap, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    private storage = inject(STORAGE);

    uploadImage(file: File){
        const filePath = `avatars/${file.name}`;
        const fileRef = ref(this.storage, file.name);

        return uploadBytesResumable(fileRef, file).pipe(
            tap((snap) => console.log(snap)),
            switchMap((snap) => getDownloadURL(fileRef))
        );
    }
}