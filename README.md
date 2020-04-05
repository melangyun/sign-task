# Signature shared Program Server Code For coding test
<br>
<br>
<br>

개인 서명을 저장하고, 팀을 만들어 팀 내에서 공유하기 위한 서비스 입니다.
<br>
<br>


## 시작하기
<br>
<br>

1. `git clone` 
2. 터미널에 `npm install` 을 사용하여 필요한 모듈들을 다운받습니다.
   * `npm audit fix`가 필요 할 수 도 있습니다.
3. MariaDB를 사용하여 설정이 필요합니다.
    * MariaDB 다운로드, 설정 후 `.env` 및 `.dev.env` 파일을 local option에 맞게 설정해주세요.
4. `npm start `를 실행하면 **3001**번(혹은 .env에 설정되어있는 포트로) 포트로 서버가 켜집니다.
<br>
<br>
<br>
<br>

## Stack 

- nodeJS
- nestJS
- mariaDB
- typescript
- typeORM
<br>
<br>
<br>
<br>



## Database Schema 
<br>
<br>

[erd cloud](https://www.erdcloud.com/d/TGijkuBc6uEc86SqR)
<br>
<br>
<br>

![image](https://user-images.githubusercontent.com/52588452/78470034-1c62ee00-7761-11ea-823a-019340c1d70d.png)


<br>
<br>
<br>
<br>
<br>





## API

> **Swagger UI**를 사용하여, 서버 실행 후 `localhost:{port}/api` 주소로 접속하면 간단한 API 테스팅을 할 수 있습니다.
<br>

`/auth/login`과 `/auth/register`, `/`요청과  `/api` API문서를 제외하고 전체 등록된 유저에게만 제공되는 서비스로 구현되어 로그인이 필요합니다. <br>
<br>

`/auth/register` 이후 `/auth/login`으로 JWT 토큰을 발급받아 페이지 우상단의 **Authorize** 버튼에 token을 입력하면 header 설정을 간단히 할 수 있습니다.
<br>
<br>


---
<br>
<br>

### 	/
<br>
<br>
<br>

​	기본 api입니다.
<br>
<br>

---

### 	/file

​		/file 의 요청들은 사진 업로드 -> 저장단계를 위하여 있는 API입니다.
​		Client구현 시 `/signature (POST)` 요청 혹은 `/signature (DELTE)` 요청과 함께 사용되어야 합니다.

- **POST** 
  *multipart/form-data* 형식으로 파일을 선택하여 올릴 수 있습니다.
  업로드 된 파일은 root path에 `uploads`폴더에 생성됩니다.

- **DELETE**
  upload 된 사진을 지우는 요청입니다. 
  `uploads`폴더에 생성된 사진 이름을 확장자까지 입력하면 사진이 삭제됩니다.
<br>
<br>
<br>
<br>

---

### /user

​	유저에 대한 서비스 입니다.

- /suer/{search} (GET)
  - Parameters로 찾고자 하는 유저 keyword를 입력하면 nickname 혹은 id가 일치하는 검색 결과를 반환합니다.
<br>
<br>
<br>

---

### /signature

​	서명에 대한 서비스입니다.

- /signature (POST)
  - 서명 등록을 할 수 있습니다.
  - 팀 서명의 경우 권한이 있는 경우에만 등록됩니다.
  - 등록이 성공된 경우, 등록된 서명의 id값이 반환됩니다.


- /signature (DELETE)
  - 서명 삭제를 할 수 있습니다.
  - 팀 서명의 경우 권한이 있는 경우에만 삭제가 승인됩니다.


- /signature/user (GET)
  - 개인 서명 목록 전체를 반환받습니다.


- /signature/team/{teamId}
  - 요청받은 팀 서명 목록 전체를 반환받습니다.
  - 팀 서명의 경우 열람 권한이 있는 경우에만 반환 받습니다.


- /signature/{signId}
  - 서명 아이디로 서명의 정보를 반환받습니다.
  - 개인 서명의 경우 본인의 경우에만 정보를 반환받을 수 있으며, 팀 서명의 경우 권한이 있는 경우에만 승인됩니다.
<br>
<br>
<br>

---

### /team

​	팀에 관련된 서비스 입니다.

- /team/{teamId} (GET)
  - 팀정보를 반환합니다.
  - 팀에 소속되어 있는 경우에만 승인되며, 삭제된 팀은 접근이 제한됩니다.


- /team (GET)
  - 로그인한 유저가 소속되어 있는 팀(들)을 반환합니다.
  - reponse 는 `{ teamsByLeader : Team[], teamsByMember : Team[] }`의 형태로, 리더로서 참여한 팀과, 일반 맴버로서 참여한 팀이 분리되어 반환됩니다.


- /team (POST)
  - 팀 생성 요청입니다.
  - 생성자는 자동으로 팀 리더로 등록됩니다.
  - 또한 서명 등록, 삭제, 조회의 모든 권한이 부여됩니다.


- /team (DELETE)
  - 팀 삭제 요청입니다.
  - 팀 삭제요청은 팀 리더만이 접근할 수 있으며, 삭제 이후 수정이나 조회가 되지 않습니다.


- /team/{teamId}/user (GET)
  - 팀에 소속된 유저(들)의 아이디, 닉네임, 권한 리스트가 반환됩니다.


- /team/user (POST)
  - 팀에 맴버를 등록합니다.
  - 기존에 가입된 유효한 유저만 등록될 수 있으며, 팀 리더만 접근 가능합니다.


- /team/user (PATCH)
  - 팀 서명에 대한 유저 권한을 수정합니다. 팀 리더만 접근 가능합니다.
  - auth의 형식은 `lookup : boolean, add : boolean, delete : boolean `를 지켜야 합니다!
  - lookup은 서명 조회, add는 추가, delete 은 삭제에 대한 권한 설정입니다.


- /team/user (DELETE)
  - 팀에 소속된 맴버를 지우는 요청입니다. 팀 리더만 접근 가능합니다.


- /team/{teamId}/user/auth (GET)
  - 유저가 소속된 팀에서 유저 개인의 권한 정보를 반환 받습니다.
<br>
<br>
<br>
<br>

---
### auth

- /auth/login (POST)
  - 로그인 요청입니다.
  - 유저 정보와 함께 JWT가 반환됩니다.
- /auth/register (POST)
  - 유저 등록 요청입니다. 유저가 등록하는 id는 중복되지 않아야 합니다.


