import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

// interface
interface BaseResponse<T> {
	code: number;
	data: T;
}

interface ProjectInfo {
	id: number;
	name: string;
	status: any;
	description: string;
	create_user_id: string;
	prefix: string;
	font_family: string;
	font_format: string;
	font_is_old: number;
	guid: any;
	created_at: string;
	updated_at: string;
	deleted_at: any;
}

interface FontInfo {
	svg_file: string;
	woff_file: string;
	woff2_file: string;
	eot_file: string;
	ttf_file: string;
	js_file: string;
	css_file: string;
	demo_file: string;
	json_file: string;
	id: number;
	owner_id: number;
	owner_type: string;
	css_font_face_src: string;
	created_at: string;
	updated_at: string;
}

interface User {
	avatar: string;
	weixin_code: string;
	alipay_code: string;
	id: number;
	nickname: string;
	bio?: string;
	role: number;
	avatar_file_name?: string;
	avatar_tiny_file_name?: string;
	avatar_small_file_name?: string;
	status: number;
	from_site?: string;
	account_type: number;
	created_at: string;
	updated_at: string;
	ProjectUser: ProjectUser;
}

interface ProjectUser {
	id: number;
	user_id: number;
	project_id: number;
	role: number;
}

interface Creator {
	avatar: string;
	weixin_code: string;
	alipay_code: string;
	id: number;
	nickname: string;
	bio: string;
	role: number;
	avatar_file_name: any;
	avatar_tiny_file_name: any;
	avatar_small_file_name: any;
	status: number;
	from_site: any;
	account_type: number;
	created_at: string;
	updated_at: string;
}

interface Icon {
	id: number;
	name: string;
	project_id: number;
	projectId: number;
	show_svg: string;
	unicode: string;
	font_class: string;
	freeze: number;
	path_attributes: string;
}

interface ProjectRespone {
	project: ProjectInfo;
	font: FontInfo;
	users: User[];
	creator: Creator;
	icons: Icon[];
	role_in_project: number;
}

/** iconfont 项目编号 */
const projectId = 3232;
/** iconfont 账号登录token */
const token = '';
const baseUrl = 'https://www.iconfont.cn/api/';
/** 发送请求时附带的cookie，从network中可以查到 */
const EGG_SESS_ICONFONT =
	'';

const AUTO_GENERATE_REGEXP = /(\/\* auto-generate: start \*\/)\n([\s\S]+)\n(\/\* auto-generate: end \*\/)/g;
const SCRIPT_URL_REGEXP = /(\/\* auto-iconfont-url: start \*\/)\n([\s\S]+)\n(\/\* auto-iconfont-url: end \*\/)/g;
const SRC = path.resolve(__dirname, '../../src/components/yi-icon/index.tsx');

export function fetchProjectInfo({ id }: { id: number }): Promise<BaseResponse<ProjectRespone>> {
	return fetch(`${baseUrl}project/detail.json?pid=${id}&ctoken=${token}&t=${new Date().getTime()}`, {
		headers: {
			cookie: `EGG_SESS_ICONFONT=${EGG_SESS_ICONFONT}`,
		},
	}).then(res => res.json());
}

async function main() {
	const {data: { icons, project, font },
	} = await fetchProjectInfo({ id: projectId });
	// add ts type
	const iconNames = icons.map(i => `'${project.prefix}${i.font_class}'`);
	iconNames.sort();
	iconNames.unshift('export type IconType =');
	const tsType = `${iconNames.join('\n  | ')};`;

	const iconSrc = fs.readFileSync(SRC, { encoding: 'utf-8' });
	const replacedIconSrc = iconSrc.replace(AUTO_GENERATE_REGEXP, (a, p1, p2, p3) => `${p1}\n${tsType}\n${p3}`);
	if (iconSrc !== replacedIconSrc) {
		fs.writeFileSync(SRC, replacedIconSrc, { encoding: 'utf-8' });
	}
	// add sourceUrl
	const jsUrl = [`'${font.js_file}'`];
	jsUrl.unshift('const sourceUrl =');
	const urlCode = `${jsUrl.join(' ')};`;
	const replacedUrl = iconSrc.replace(SCRIPT_URL_REGEXP, (a, p1, p2, p3) => `${p1}\n${urlCode}\n${p3}`);
	if (iconSrc !== replacedUrl) {
		fs.writeFileSync(SRC, replacedUrl, { encoding: 'utf-8' });
	}
}

main();
