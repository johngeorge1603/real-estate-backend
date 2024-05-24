import prisma from "../lib/prisma.js";



// GET ALL POSTS
export const getPosts = async (req, res) => {

    const query = req.query;
    console.log(query);
    try{

        const posts = await prisma.post.findMany({
            where: {
              type: query.type || undefined,
              property: query.property || undefined,
              bedroom: parseInt(query.bedroom) || undefined,
              price: {
                gte: parseInt(query.minPrice) || 0,
                lte: parseInt(query.maxPrice) || 10000000,
              },
            },
          });
      
        //   setTimeout(() => {
          res.status(200).json(posts);
        //   }, 200);

    } catch(err) {
        console.log(err);
        res.status(500).json({message:"Failed to get posts!"})
    }
}



// GET POST
export const getPost = async (req, res) => {
  const id = req.params.id;
  
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        return res.status(200).json({ ...post, isSaved: !!saved });
      } catch (err) {
        console.log('Token verification failed', err);
      }
    }

    res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};



// ADD POST
export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
  
    try {
      const newPost = await prisma.post.create({
        data: {
          ...body.postData,
          userId: tokenUserId,
          postDetail: {
            create: body.postDetail,
          },
        },
      });
      res.status(200).json(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  };



// UPDATE POST
export const updatePost = async (req, res) => {

    try{

    } catch(err) {
        console.log(err);
        res.status(500).json({message:"Failed to update post!"})
    }
}



// DELETE POST
export const deletePost = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    try{

        const post = await prisma.post.findUnique({
            where:{id}
        });

        if(post.userId !== tokenUserId) {
            return res.status(403).json({message:"Not Authorized!"})
        };

        await prisma.post.delete({
            where:{id}
        });

        res.status(403).json({message:"Post Deleted"})

    } catch(err) {
        console.log(err);
        res.status(500).json({message:"Failed to delete post!"})
    }
}