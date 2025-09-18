import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: 'No token provided' });
        }

        try {

            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("SECRET:", process.env.JWT_SECRET);

            if (tokenDecode.id) {
                if (!req.body) req.body = {};
                req.body.userId = tokenDecode.id;
            } else {
                return res.json({ success: false, message: 'Not authorized login again' });
            }

            next();
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }

    };
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ success: false, message: 'Unauthorized' });
    // }

    // const token = authHeader.split(' ')[1];
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    //     req.userId = decoded.id;
    //     next();
    // } catch (err) {
    //     res.status(403).json({ success: false, message: 'Invalid Token' });
    // }
// };

export default userAuth;

