

export const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId);
    res.status(200).json({message:"You are Authenticated!"})

}
// export const shouldBeAdmin = async (req, res) => {
//     console.log(req.userId);
//     res.status(200).json({message:"You are Authenticated!"})
// }

