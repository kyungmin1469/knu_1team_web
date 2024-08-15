//(front)사용자가 mypage 버튼 혹은 url을 통해서 이동하면,
//(front + back)페이지 접근 후 local strage에 있는 token을 꺼내고, back으로 보내 유효성을 확인한다.
//(back)유효성 검사에 따른 사용자 인증여부를 프론트로 리턴. res.json({isVerify : true})
//(front)리턴받은 응답값을 통해 token이 유효하다면 페이지 사용, 아니라면 signin페이지로 이동.
