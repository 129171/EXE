const axios = require("axios");

const authToken = "7jNBweQvL7xTtKzPCcGrZw6NL07Z8wflaAJiQxuN";

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

exports.getSoundById = async (req, res) => {
    try {
        let soundId = req.params.id;
        let url = `https://freesound.org/apiv2/sounds/${soundId}/?token=${authToken}`;
        let response = await axios.get(url);

        res.json({ audioUrl: response.data.previews["preview-hq-mp3"] });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết âm thanh:", error);
        res.status(500).json({ error: "Lỗi khi phát âm thanh" });
    }
};

exports.getSoundByIdSpec = async (id) => {
    try {
        const url = `https://freesound.org/apiv2/sounds/${id}/?token=${authToken}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết âm thanh ID ${id}:`, error);
        return null;
    }
};

exports.getSounds = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.render("index", { sounds: [], error: "Vui lòng nhập từ khóa!" });
        }

        const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&filter=duration:[10 TO *]&sort=rating_desc&page_size=50&token=${authToken}`;
        const response = await axios.get(url);
        const soundList = response.data.results;

        console.log("Dữ liệu API trả về:", response.data.results);

        if (!Array.isArray(soundList) || soundList.length === 0) {
            return res.render("index", { sounds: [], error: "Không có âm thanh nào phù hợp" });
        }
        // Lấy danh sách âm thanh & thêm duration

            const sounds = await Promise.all(
                soundList.map(async (sound) => {
                    const details = await this.getSoundByIdSpec(sound.id);
                    return {
                        id: sound.id,
                        name: sound.name,
                        preview: details?.previews?.["preview-hq-mp3"] || null,
                        duration: formatDuration(details?.duration || 0),
                    };
                })
            );

            res.render("index", { sounds : response.data.results, error: null });
        
        // console.log(sounds); 
    } catch (error) {
        console.error("Lỗi khi lấy danh sách âm thanh:", error);
        res.render("index", { sounds: [], error: "Lỗi khi lấy danh sách âm thanh" });
    }
}; 

exports.getRainSound = async (req, res) => {
    try {
        const url = `https://freesound.org/apiv2/search/text/?query=rain&filter=duration:[10 TO *]&token=${authToken}`;
        const response = await axios.get(url);
        const soundList = response.data.results;

        console.log("Dữ liệu API trả về:", response.data.results);
        // Lấy danh sách âm thanh & thêm duration
        if (Array.isArray(soundList)) {
            const sounds = await Promise.all(
                soundList.map(async (sound) => {
                    const details = await this.getSoundByIdSpec(sound.id);
                    return {
                        id: sound.id,
                        name: sound.name,
                        preview: details?.previews?.["preview-hq-mp3"] || null,
                        duration: formatDuration(details?.duration || 0),
                    };
                })
            );

            res.render("rainSound", { sounds, error: null });
        } else {
            // Nếu không có kết quả hợp lệ, gửi thông báo lỗi
            console.error("Dữ liệu không hợp lệ: response.data.results không phải là mảng");
            res.render("rainSound", { sounds: [], error: "Không có âm thanh nào phù hợp" });
        }
        // console.log(sounds); 

    } catch (error) {
        console.error("Lỗi khi lấy danh sách âm thanh:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách âm thanh" });
    }
};

exports.getSoothingSound = async (req, res) => {
    try {
        const url = `https://freesound.org/apiv2/search/text/?query=soothing&filter=duration:[10 TO *]&token=${authToken}`;
        const response = await axios.get(url);
        const soundList = response.data.results;

        console.log("Dữ liệu API trả về:", response.data.results);
        // Lấy danh sách âm thanh & thêm duration
        if (Array.isArray(soundList)) {
            const sounds = await Promise.all(
                soundList.map(async (sound) => {
                    const details = await this.getSoundByIdSpec(sound.id);
                    return {
                        id: sound.id,
                        name: sound.name,
                        preview: details?.previews?.["preview-hq-mp3"] || null,
                        duration: formatDuration(details?.duration || 0),
                    };
                })
            );

            res.render("soothingSound", { sounds, error: null });
        } else {
            // Nếu không có kết quả hợp lệ, gửi thông báo lỗi
            console.error("Dữ liệu không hợp lệ: response.data.results không phải là mảng");
            res.render("soothingSound", { sounds: [], error: "Không có âm thanh nào phù hợp" });
        }
        // console.log(sounds); 

    } catch (error) {
        console.error("Lỗi khi lấy danh sách âm thanh:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách âm thanh" });
    }
};

exports.getOceanSound = async (req, res) => {
    try {
        const url = `https://freesound.org/apiv2/search/text/?query=ocean&filter=duration:[10 TO *]&token=${authToken}`;
        const response = await axios.get(url);
        const soundList = response.data.results;

        console.log("Dữ liệu API trả về:", response.data.results);
        // Lấy danh sách âm thanh & thêm duration
        if (Array.isArray(soundList)) {
            const sounds = await Promise.all(
                soundList.map(async (sound) => {
                    const details = await this.getSoundByIdSpec(sound.id);
                    return {
                        id: sound.id,
                        name: sound.name,
                        preview: details?.previews?.["preview-hq-mp3"] || null,
                        duration: formatDuration(details?.duration || 0),
                    };
                })
            );

            res.render("oceanSound", { sounds, error: null });
        } else {
            // Nếu không có kết quả hợp lệ, gửi thông báo lỗi
            console.error("Dữ liệu không hợp lệ: response.data.results không phải là mảng");
            res.render("oceanSound", { sounds: [], error: "Không có âm thanh nào phù hợp" });
        }
        // console.log(sounds); 

    } catch (error) {
        console.error("Lỗi khi lấy danh sách âm thanh:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách âm thanh" });
    }
};

exports.getPianoSound = async (req, res) => {
    try {
        const url = `https://freesound.org/apiv2/search/text/?query=piano&sort=rating_desc&filter=duration:%5B10%20TO%20*%5D&page_size=50&token=${authToken}`;
        const response = await axios.get(url);
        const soundList = response.data.results;

        console.log("Dữ liệu API trả về:", response.data.results);
        // Lấy danh sách âm thanh & thêm duration
        if (Array.isArray(soundList)) {
            const sounds = await Promise.all(
                soundList.map(async (sound) => {
                    const details = await this.getSoundByIdSpec(sound.id);
                    return {
                        id: sound.id,
                        name: sound.name,
                        preview: details?.previews?.["preview-hq-mp3"] || null,
                        duration: formatDuration(details?.duration || 0),
                    };
                })
            );

            res.render("pianoSound", { sounds, error: null });
        } else {
            // Nếu không có kết quả hợp lệ, gửi thông báo lỗi
            console.error("Dữ liệu không hợp lệ: response.data.results không phải là mảng");
            res.render("pianoSound", { sounds: [], error: "Không có âm thanh nào phù hợp" });
        }
        // console.log(sounds); 

    } catch (error) {
        console.error("Lỗi khi lấy danh sách âm thanh:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách âm thanh" });
    }
};
