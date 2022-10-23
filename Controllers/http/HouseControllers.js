const poolCtrlDB = require("../../Database/ctrlDB");
const Common = require("../../Libraries/Common");

class HouseControllers {
    static CreateHouse = async (req, res) => {
        let data, conn, sql, resp;
        try {
            const {
                name,
                desc,
                price,
                post_code,
            } = req.body;

            conn = await poolCtrlDB.getConnection();

            sql = `INSERT INTO house SET 
                        name = ${conn.escape(name)},
                        description = ${conn.escape(desc)},
                        price = ${conn.escape(price)},
                        post_code = ${conn.escape(post_code)},
                        create_dt = now()`;
            resp = await Common.handleQuery(conn.query(sql));
            if (!resp.status) {
                throw resp.data
            }

            data = {
                status: 200,
                data: [],
                msg: "create success"
            };

            return Common.response(conn, res, data);


        } catch (e) {
            console.log(e);
            data = {
                status: 500,
                data: e?.stack ? e.stack : e,
                message: "Fails"
            };
            return Common.response(conn, res, data);
        };
    };

    static GetHouses = async (req, res) => {
        let data, conn, sql, resp
        try {
            const {
                skip,
                take
            } = req.query;

            conn = await poolCtrlDB.getConnection();
            sql = `SELECT id,name,description as "desc",price,post_code,create_dt FROM house LIMIT ${take} OFFSET ${skip}`;
            resp = await Common.handleQuery(conn.query(sql));
            if (!resp.status) {
                throw resp.data
            }

            data = {
                status: 200,
                payload: resp.data,
                count: resp.data.length
            };

            return Common.response(conn, res, data);

        } catch (e) {
            console.log(e);
            data = {
                status: 500,
                data: e?.stack ? e.stack : e,
                message: "Fails"
            };
            return Common.response(conn, res, data);
        };
    };

    static GetPostcodes = async (req, res) => {
        let data, conn, sql, resp
        try {
            conn = await poolCtrlDB.getConnection();
            sql = `SELECT post_code FROM house GROUP BY post_code`;
            resp = await Common.handleQuery(conn.query(sql));
            if (!resp.status) {
                throw resp.data
            }

            data = {
                status: 200,
                payload: resp.data,
                count: resp.data.length
            };

            return Common.response(conn, res, data);

        } catch (e) {
            console.log(e);
            data = {
                status: 500,
                data: e?.stack ? e.stack : e,
                message: "Fails"
            };
            return Common.response(conn, res, data);
        };
    };

    static GetPostcode = async (req, res) => {
        let data, conn, sql, resp
        try {
            const {
                id,
            } = req.params;

            conn = await poolCtrlDB.getConnection();
            sql = `SELECT price FROM house WHERE post_code = ${conn.escape(id)} AND post_code > 0`;
            resp = await Common.handleQuery(conn.query(sql));
            if (!resp.status) {
                throw resp.data
            } else if (resp?.data.length == 0) {
                data = {
                    status: 404,
                    data: [],
                    message: "Not found post_code data."
                };

                return Common.response(conn, res, data);
            }

            resp.data.sort(function (a, b) { return a.price - b.price; });
            let i = resp.data.length / 2;
            let median = i % 1 == 0 ? (parseFloat(resp.data[i - 1].price) + parseFloat(resp.data[i].price)) / 2 : resp.data[Math.floor(i)].price;
            let avg = resp.data.reduce((r, c, i, a) => r + c.price / a.length, 0)
            data = {
                status: 200,
                payload: {
                    average: avg,
                    median: median
                },
                message: "success"
            };

            return Common.response(conn, res, data);

        } catch (e) {
            console.log(e);
            data = {
                status: 500,
                data: e?.stack ? e.stack : e,
                message: "Fails"
            };
            return Common.response(conn, res, data);
        };
    };


};

module.exports = HouseControllers;