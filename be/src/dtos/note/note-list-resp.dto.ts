import {PageDto} from "../common/page.dto";
import {NoteDto} from "./note.dto";
import {PageMetaDto} from "../common/page-meta.dto";

export class NoteListRespDto extends PageDto<NoteDto>{
    constructor(notes: NoteDto[], meta: PageMetaDto) {
        super(notes, meta);
    }
}