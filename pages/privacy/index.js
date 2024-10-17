import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy</title>
      </Head>
      <Heading />
      <h1 className="relative mt-[64px] pt-6 text-3xl font-bold text-pink-300">
        <Link href="/" className="text-3xl font-bold mx-4">
          ←
        </Link>
        Privacy
      </h1>
      <h1>Chính Sách Bảo Mật và Quyền Riêng Tư</h1>
      <ul className="px-3 ">
        <li>
          <h3 className="font-bold text-xl">1. Giới thiệu</h3>
          <div className="px-3">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            người dùng. Chính sách này giải thích cách chúng tôi thu thập, sử
            dụng, và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng ứng dụng
            mạng xã hội của chúng tôi.
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">2. Thông tin chúng tôi thu thập</h3>
          <div className="px-3">
            Chúng tôi có thể thu thập và lưu trữ các loại thông tin sau đây:{" "}
            <br />
            - Thông tin cá nhân: Khi bạn đăng ký tài khoản, chúng tôi có thể yêu
            cầu bạn cung cấp một số thông tin cá nhân như tên, địa chỉ email, số
            điện thoại, và ảnh đại diện.
            <br />
            - Thông tin hồ sơ: Bạn có thể cung cấp thêm thông tin trong hồ sơ cá
            nhân của bạn, bao gồm mô tả bản thân, sở thích, và vị trí địa lý.
            <br />
            - Nội dung do người dùng tạo: Chúng tôi lưu trữ tất cả nội dung mà
            bạn tạo, bao gồm bài đăng, bình luận, hình ảnh, và video.
            <br />
            - Dữ liệu tương tác: Chúng tôi theo dõi cách bạn tương tác với ứng
            dụng, bao gồm các bài đăng bạn thích, chia sẻ và các người dùng khác
            bạn kết nối.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">
            3. Cách chúng tôi sử dụng thông tin của bạn
          </h3>
          <div className="px-3">
            Chúng tôi sử dụng thông tin cá nhân của bạn cho các mục đích sau:{" "}
            <br />
            - Cung cấp dịch vụ: Để tạo và duy trì tài khoản của bạn, cung cấp
            các tính năng và dịch vụ của ứng dụng.
            <br />
            - Cải thiện trải nghiệm người dùng: Chúng tôi sử dụng thông tin để
            cải thiện ứng dụng và phát triển các tính năng mới.
            <br />
            - Giao tiếp: Chúng tôi có thể gửi thông báo, cập nhật và thông tin
            khác liên quan đến tài khoản của bạn hoặc ứng dụng.
            <br />
            - Quảng cáo và tiếp thị: Chúng tôi có thể sử dụng thông tin để cá
            nhân hóa quảng cáo và thông điệp tiếp thị.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">4. Chia sẻ thông tin của bạn</h3>
          <div className="px-3">
            Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên
            thứ ba. Tuy nhiên, chúng tôi có thể chia sẻ thông tin của bạn trong
            các trường hợp sau: <br />
            - Với các đối tác: Chúng tôi có thể chia sẻ thông tin với các đối
            tác tin cậy để cung cấp dịch vụ hoặc hỗ trợ tiếp thị.
            <br />
            - Theo yêu cầu của pháp luật: Chúng tôi có thể tiết lộ thông tin nếu
            cần thiết để tuân thủ luật pháp hoặc bảo vệ quyền lợi hợp pháp của
            chúng tôi.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">5. Bảo mật thông tin</h3>
          <div className="px-3">
            Chúng tôi sử dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin
            cá nhân của bạn khỏi truy cập trái phép, sử dụng sai mục đích, và rò
            rỉ. Tuy nhiên, không có phương thức truyền tải dữ liệu qua Internet
            hay phương thức lưu trữ điện tử nào là 100% an toàn. Vì vậy, mặc dù
            chúng tôi nỗ lực hết sức để bảo vệ thông tin của bạn, chúng tôi
            không thể đảm bảo an toàn tuyệt đối.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">6. Quyền của bạn</h3>
          <div className="px-3">
            Bạn có quyền:
            <br />
            - Truy cập và chỉnh sửa thông tin: Bạn có thể truy cập và chỉnh sửa
            thông tin cá nhân của mình bất kỳ lúc nào trong phần cài đặt tài
            khoản.
            <br />
            - Yêu cầu xóa thông tin: Bạn có thể yêu cầu chúng tôi xóa thông tin
            cá nhân của bạn, trừ khi chúng tôi cần giữ lại để tuân thủ pháp
            luật.
            <br />
            - Từ chối tiếp thị: Bạn có thể từ chối nhận thông tin tiếp thị bất
            cứ lúc nào bằng cách làm theo hướng dẫn hủy đăng ký trong các thông
            báo mà chúng tôi gửi.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">7. Thay đổi chính sách</h3>
          <div className="px-3">
            Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay
            đổi sẽ được thông báo cho bạn thông qua ứng dụng hoặc qua email. Bạn
            nên thường xuyên kiểm tra chính sách để nắm bắt những thay đổi.
            <br />
          </div>
        </li>
        <li>
          <h3 className="font-bold text-xl">8. Liên hệ</h3>
          <div className="px-3">
            Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về chính sách bảo mật này,
            xin vui lòng liên hệ với chúng tôi qua địa chỉ email hỗ trợ của
            chúng tôi.
            <br />
          </div>
        </li>
      </ul>
    </Layout>
  );
}
