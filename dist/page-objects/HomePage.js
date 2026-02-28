"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
class HomePage {
    page;
    url = '/';
    constructor(page) {
        this.page = page;
    }
    async goto() {
        await this.page.goto(this.url);
    }
}
exports.HomePage = HomePage;
