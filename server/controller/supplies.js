const { supplies, pick, img, pet, Sequelize } = require('../model');
const Op = Sequelize.Op;

// 용품 판매글 조회 & 메인페이지 인기글 조회
exports.getData = async (req, res) => {
  let petType = req.query.type;
  console.log('petType', petType);
  console.log('req.query', req.query.location);

  // 메인 페이지 에서 렌더 시 및 판매페이지에서 위치 기준으로 렌더시
  if (petType === 'basic') {
    // 메인페이지에서 렌더 시
    if (req.query.location === 'location') {
      const mypage = await supplies.findAll({
        include: [
          {
            model: img,
            required: false,
          },
          {
            model: pick,
            required: false,
          },
        ],
      });
      res.send(mypage);
    } else {
      // 판매 페이지에서 위치 기준으로 렌더시
      const basic = await supplies.findAll({
        include: [
          {
            model: img,
            required: false,
          },
          {
            model: pick,
            required: false,
          },
        ],
        where: {
          location: { [Op.startsWith]: req.query.location.region_2depth_name },
        },
      });
      res.send(basic);
    }
  } else if (petType === 'puppy') {
    const puppy = await supplies.findAll({
      include: [
        {
          model: img,
          required: false,
        },
        {
          model: pick,
          required: false,
        },
        {
          model: pet,
          required: false,
          attributes: ['id'],
          where: {
            petType: '강아지',
          },
        },
      ],
      where: {
        location: { [Op.startsWith]: req.query.location.region_2depth_name },
      },
    });
    res.send(puppy);
  } else if (petType === 'cat') {
  }
};

// 판매 페이지 검색
exports.postSearch = async (req, res) => {
  let searchWord = req.body.searchData;

  supplies
    .findAll({
      include: [
        {
          model: img,
          required: false,
        },
        {
          model: pick,
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + searchWord + '%',
            },
          },
          {
            content: {
              [Op.like]: '%' + searchWord + '%',
            },
          },
        ],
      },
    })
    .then((result) => {
      // console.log('디비 조회', result);
      res.json(result);
    });
};

// 판매 완료 확인
exports.patchUpdateDeal = async (req, res) => {
  console.log(req.body.id);
  const result = await supplies.update(
    { deal: false },
    { where: { id: req.body.id } }
  );
  console.log('result', result);
  res.send(result);
};

// 메인페이지 인기글 조회
exports.getPopularPost = async (req, res) => {
  pick
    .findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('pick.id')), 'count'],
        'suppliesId',
      ],
      include: [
        {
          model: supplies,
          required: true,
        },
      ],
      group: 'suppliesId',
      raw: true,
    })
    .then((result) => {
      console.log('메인페이지 인기글 조회', result);
      res.send(result);
    });
};

exports.getLikeCount = async (req, res) => {
  supplies
    .findOne({
      where: {
        id: req.query.id,
      },
      attributes: ['likeCount'],
    })
    .then((result) => {
      res.send(result);
    });
};

exports.getImgs = async (req, res) => {
  console.log(req.query);
  img
    .findAll({
      where: { suppliesId: req.query.suppliesId },
    })
    .then((result) => {
      console.log('리절', result);
      res.send(result);
    });
};
