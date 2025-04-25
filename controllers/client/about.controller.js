module.exports.index = (req, res)=> {
    const team = [
        {
          name: "Trịnh Hoàng Hiệp",
          role: "Chủ tịch",
          avatar: "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/440940846_1775054326320723_5273541912299283205_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=NfGVpNGbH5YQ7kNvwGbd4za&_nc_oc=Adk2CmKb1IlFGzbhNZ24VOOKAV1TyJoXHtRbYGt-PLLqV34ntWg2HrsIhtG4TeWeRRc&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=-t1NT8p2ToiHPrRFyLk16Q&oh=00_AfGJeVaHK5e1kJwGKW80Cc_vP7zASovQLoeamrzl66J_SQ&oe=6811A11E",
        },
        {
          name: "Phạm Văn Mách",
          role: "Giám đốc thể hình",
          avatar: "https://file.qdnd.vn/data/images/0/2017/10/07/vanphong/07102017p1p7.jpg?w=578",
        },
        {
          name: "Lý Đức",
          role: "Chuyên gia dinh dưỡng",
          avatar: "https://nuedu.vn/cdn/data/brandlogo/huyen-thoai-ly-duc.jpg",
        },
      ];
    res.render("client/pages/about/index", {
        pageTitle: "Về chúng tôi",
        team,
    });
}