"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const video_1 = __importDefault(require("../models/video"));
class VideoManager {
    constructor() {
        this.file = [
            {
                name: 'vide',
                link: 'vide'
            }
        ];
    }
    addVideo(filename, filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newVideo = new video_1.default({
                    name: filename,
                    link: filepath,
                });
                yield newVideo.save();
            }
            catch (error) {
                console.log("error on add new video ");
            }
        });
    }
    updateFile() {
        fs_1.default.writeFile('./videos.json', JSON.stringify(this.file), (err) => {
            if (err)
                throw err;
            console.log('\nVideos updated !');
        });
    }
    getVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield video_1.default.find({ name: { $ne: 'vide' } });
        });
    }
    delVideo(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield video_1.default.deleteOne({ name });
            fs_1.default.unlinkSync('./public/assets/' + name);
        });
    }
}
exports.default = VideoManager;
//# sourceMappingURL=video.js.map